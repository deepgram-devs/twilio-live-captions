const Video = Twilio.Video;

const roomName = document.getElementById('roomName');
const joinButton = document.getElementById('join');
const entry = document.getElementById('entry');
const videos = document.getElementById('videos');
const sender = document.getElementById('sender');
const caption = document.getElementById('message');
const localDataTrack = new Video.LocalDataTrack();

const messageQueue = [];

joinButton.addEventListener('click', async (e) => {

  const userIdentity = identity.value;
  const room = roomName.value;
  if (userIdentity.length > 0 && room.length > 0) {
    await join(userIdentity, room);
  }
  else {
    alert('Please provide a name for your room & your name.');
  }
});

async function join(identity, room) {

  const response = await fetch(`/token/${room}/${identity}`);

  if (response.ok) {
    const { token, dg } = await response.json();

    Video.createLocalTracks({
      audio: true,
      video: { width: 640 }
    }).then(localTracks => {
      return Video.connect(token, {
        name: room,
        tracks: [...localTracks, localDataTrack]
      });
    }).then(room => {

      window.addEventListener('beforeunload', () => {
        room.disconnect();
      });

      startTranscription(dg, identity);

      console.log(`Connected to Room: ${room.name}`);
      entry.style.display = "none";
      videos.style.display = "block";

      room.localParticipant.tracks.forEach(publication => {
        const track = publication.track;
        videos.appendChild(track.attach());
      });

      room.on('participantConnected', participant => {
        console.log(`Participant "${participant.identity}" connected`);

        participant.on

        participant.tracks.forEach(publication => {
          if (publication.isSubscribed) {
            const track = publication.track;
            if (track.kind === 'video' || track.kind === 'audio') {
              videos.appendChild(track.attach());
            }
          }
        });

        participant.on('trackSubscribed', track => {
          if (track.kind === 'video' || track.kind === 'audio') {
            videos.appendChild(track.attach());
          } else {
            track.on('message', function (message) {
              handleMessage(message);
            });
          }
        });
      });

      room.participants.forEach(participant => {
        participant.tracks.forEach(publication => {
          if (publication.track) {
            if (publication.track.kind === 'video' || publication.track.kind === 'audio') {
              videos.appendChild(track.attach());
            } else {
              track.on('message', function (message) {
                handleMessage(message);
              });
            }
          }
        });

        participant.on('trackSubscribed', track => {
          if (track.kind === 'video' || track.kind === 'audio') {
            videos.appendChild(track.attach());
          } else {
            track.on('message', function (message) {
              handleMessage(message);
            });
          }
        });
      });
    });
  }
}

function startTranscription(key, identity) {
  // Get mic
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    // Establish websocket connection
    const socket = new WebSocket(
      'wss://api.deepgram.com/v1/listen?punctuate=true',
      ['token', key]
    )

    // Once opened, start sending data
    socket.onopen = () => {
      mediaRecorder.addEventListener('dataavailable', async event => {
        if (socket.readyState == socket.OPEN) {
          if (event.data.size > 0) {
            socket.send(event.data)
          }
        }
      })
      mediaRecorder.start(1000)
    }

    // When we receive data from Deepgram...
    socket.onmessage = message => {
      const received = JSON.parse(message.data)
      // If there is a transcript and it's marked as is_final, add to transcript paragraph
      const transcript = received.channel.alternatives[0].transcript
      if (transcript && received.is_final) {
        let msg = {
          user: identity,
          transcript
        };
        localDataTrack.send(JSON.stringify(msg));
        messageQueue.push(msg)
      }
    }

    socket.onclose = () => {
      console.log({ message: 'socket closed' })
    }

    socket.onerror = error => {
      console.log({ error })
    }
  })

}

let currentMessage;
const messageTimer = setInterval(() => {
  if (messageQueue.length > 0 && !currentMessage) {
    processMessage(messageQueue.splice(0, 1)[0]);
  }
}, 1000);

function handleMessage(message) {
  messageQueue.push(JSON.parse(message));
}

function processMessage(message) {
  currentMessage = message;
  console.log(currentMessage);

  sender.innerText = `${message.user}: `;
  caption.innerText = `${message.transcript[0].toUpperCase()}${message.transcript.slice(1)}`;

  setTimeout(() => {
    sender.innerText = '';
    caption.innerText = '';
    currentMessage = null;
  }, 2000);
}
# Live Captions for Twilio Video

This sample application can be used to create a Twilio Video room with live
transcriptions for each participant.

## Prerequisites

- A [Twilio](https://www.twilio.com/) account
- A [Deepgram](https://console.deepgram.com/) account
- Optional: [Ngrok](https://ngrok.com/) for test deployment

## Getting Started

1. Clone this repository

```bash
git clone https://github.com/deepgram-devs/twilio-live-captions
cd twilio-live-captions
```

2. Create the configuration file for your application

```bash
cp .env-sample .env
```

3. Update the variables in the `.env` file with the following:

| Variable | Description |
| --- | --- |
| twilioAccountSid | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console) |
| twilioApiKey | Used to authenticate - [generate one here](https://www.twilio.com/console/runtime/api-keys) |
| twilioApiSecret | Used to authenticate - [generate one here](https://www.twilio.com/console/runtime/api-keys) |
| deepgramApiKey | API Key for the Deepgram project you're using - [generate one here](https://console.deepgram.com/) |

4. Install dependancies

```bash
npm install
```

5. Start the application

```bash
npm start
```


## Development and Contributing

Interested in contributing? We ❤️ pull requests!

To make sure our community is safe for all, be sure to review and agree to our
[Code of Conduct](./CODE_OF_CONDUCT.md). Then see the
[Contribution](./CONTRIBUTING.md) guidelines for more information.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the
project, let us know! You can either:

- [Open an issue](https://github.com/deepgram/twilio-live-captions/issues/new) on this repository
- Tweet at us! We're [@DeepgramDevs on Twitter](https://twitter.com/DeepgramDevs)

## Further Reading

Check out the Developer Documentation at [https://developers.deepgram.com/](https://developers.deepgram.com/)

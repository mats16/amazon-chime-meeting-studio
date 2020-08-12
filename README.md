# amazon-chime-broadcast-console

## Project setup

※ You need to delete `amplify/team-provider-info.json` first.

```
git clone https://github.com/mats16/amazon-chime-meeting-studio.git
cd amazon-chime-meeting-studio

rm -f amplify/team-provider-info.json

npm install
amplify init
```

Pleas answer 'No', if you are asked about Lambda Triggers for Cognito.

```
? Do you want to configure Lambda Triggers for Cognito? No
```

### Compiles and hot-reloads for development
```
npm run serve (or amplify serve)
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

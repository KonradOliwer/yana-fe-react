## \# TODO

- [ ] Add loging and logout
- [ ] Link user with notes
- [ ] Use toastify to inform user about problem instead of console
- [ ] Handle user changing page without saving data
- [ ] Spinner on loading, block sending multiple requests on double click
- [ ] Save on change with debouncing instead of button click
- [ ] handle name of note too long for sidebar

## Decisions

### Notes API

The assumption is that our BE endpoints are dedicated for frontend.
Therefore, for simplicity of communication there is one endpoint for add and update Note.
Since it doesn't make sens for FE to decide ID of Note, it's a POST endpoint.
Update is done by name attribute, since it needs to be unique for usability reasons.

### Error handling

File [apiErrors.ts](src/app/apiErrors.ts) contains configuration of error handling.
Due to changes during development, there is no logic responding different depending on error codes.
Since in full solution such logic would certainly appear, the code is left as is.
For maintenance case only default `ErrorCode` cide value was left.

## packages.json comment

```json
{
  ...
  "jest": {
    "moduleNameMapper": {
      "^axios$": "axios/dist/node/axios.cjs"
    }
  }
}
```

Is a solution for the problem, about which you can read more here:
https://stackoverflow.com/questions/73958968/cannot-use-import-statement-outside-a-module-with-axios

## Credits

Big thanks for my friend Mateusz all the advices and answering all my questions.

GitHub Copilot team for bringing to life my buddy on this journey.

Source of icons: https://flowbite.com/icons/
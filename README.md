## \# TODO

- [ ] Add loging and logout
- [ ] Link user with notes
- [ ] Use toastify to inform user about problem instead of console
- [ ] Handle user changing page without saving data
- [ ] Spinner on loading, block sending multiple requests on double click
- [ ] Save on change with debouncing instead of button click
- [ ] handle name of note too long for sidebar

Imediat

- [x] use userEvent instead of useEvent
- [x] extract layout components to take meaningful components as children
- [x] review useEffects and remove unnecessary one
- [x] rewrite test to use describe/describes for consistency
- [x] use axios for api calls
- [x] use custom hook to simplify NotesPage
- [ ] use change endpoints to be more Backend For Frontend (post create or update by name) instead of PUT
- [x] User devserver to run app

## packages.json comment

```json
  "jest": {
"moduleNameMapper": {
"^axios$": "axios/dist/node/axios.cjs"
}
}
```

Is the solution for problem described here:
https://stackoverflow.com/questions/73958968/cannot-use-import-statement-outside-a-module-with-axios

## Credits

Big thanks for my friend Mateusz all the advices and answering all my questions.

GitHub Copilot team for bringing to life my buddy on this journey.

Source of icons: https://flowbite.com/icons/
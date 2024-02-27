## \# TODO

- [ ]  Add loging and logout
- [ ]  Link user with notes
- [ ]  Use tostr to inform user about problem instead of console
- [ ]  Handle user changing page without saving data
- [ ] Add Prefetching in router or spinner on loading
- [ ] Do save on change with debouncing
- [ ] check toastify
- [ ] handle name of note too long for sidebar
- [ ] save data on change with debounce

Imediat
- [x] use userEvent instead of useEvent
- [x] extract layout components to take meaningful components as children
- [x] review useEffects and remove unnecessary one
- [x] rewrite test to use describe/describes for consistency
- [x] use axios for api calls
- [ ] use custom hook to simplify NotesPage
- [ ] use change endpoints to be more Backend For Frontend (post create or update by name) instead of PUT
- [ ] User devserver to run app
- [ ] review and code then clean it up

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
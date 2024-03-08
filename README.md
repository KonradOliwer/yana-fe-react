## \# TODO

- [ ] Add loging and logout
- [ ] Link user with notes
- [ ] Use toastify to inform user about problem instead of console
- [ ] Handle user changing page without saving data
- [ ] Spinner on loading, block sending multiple requests on double click
- [ ] Save on change with debouncing instead of button click
- [ ] handle name of note too long for sidebar


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

Big thanks for my friend [Mateusz](https://github.com/Mati20041) all the advices and answering all my questions.

Source of icons: https://flowbite.com/icons/
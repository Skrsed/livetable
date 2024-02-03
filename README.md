### LIVETABLE APP

#### Desc:
- Event driven table with live updating data

#### Functionality
- Edit table header based on set of records keys
- CRUD records

#### How to run:
- For local deployment you may need to set build mode in frontend's package.json file
    - 'development' for running on localhost and 'production' for running on VPS (prod by default)
- in most cases it would be better to run your env localy without containers for better user EX
- `tldr` if you want to build production-like localy you'll need to change mode in frontend package.json to development

#### TODO:
- tests with cypress
- unit tests
- components testing
- dev containers based on some watcher
- make stage environment for localhost with separate compose file
# systemic-pg
A [systemic](https://github.com/guidesmiths/systemic) pg component

## Usage
```js
const System = require('systemic')
const postgres = require('systemic-pg')

new System()
    .configure({
        postgres: {
            host: 'localhost',
            database: 'example'
        }
    })
    .add('logger', console)
    .add('postgres', postgres()).dependsOn('config', 'logger')
    .start((err, components) => {
        // Do stuff with components.pg
    })
```

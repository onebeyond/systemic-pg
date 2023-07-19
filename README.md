[![Maintainability](https://api.codeclimate.com/v1/badges/8fd0f7468cac4f37fd50/maintainability)](https://codeclimate.com/github/onebeyond/systemic-pg/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8fd0f7468cac4f37fd50/test_coverage)](https://codeclimate.com/github/onebeyond/systemic-pg/test_coverage)

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
            onConnect: [
                "SET client_min_messages = WARNING",
                "SET search_path = custom,public"
            ]
        }
    })
    .add('logger', console)
    .add('postgres', postgres()).dependsOn('config', 'logger')
    .start((err, components) => {
        // Do stuff with components.pg
    })
```

### <= 0.12
systemic-pg relies on the underlying [pg](https://github.com/brianc/node-postgres) library, which uses native promises and is therefore incompatible with node 0.12 and below. You can monkey patch Promise or use an alternative promise implementation by following [these](https://github.com/brianc/node-pg-pool#bring-your-own-promise) instructions.


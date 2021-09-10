const fs = require('fs');
const axios = require('axios');

class SearchData {
    history = [];
    dbPath = "./db/database.json"

    constructor() {
        this.readDataBase();
    }

    get paramsMapQuery() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es',
        }
    }

    get historyUpperFirst() {
        return this.history.map((singlePlace) => {
            let words = singlePlace.split(' ');
            words = words.map((p) => p[0].toUpperCase() + p.substring(1));
            return words.join('');
        });
    }

    get paramsWeatherQuery() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es',
        }
    }

    async cityTask(place) {
        try {
            //- Modelamos la petición HTTP con axios.create() y luego la llamamos con .get() 
            const cityAxiosConfig = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapQuery,
            });
            //- De acuerdo a la configuración que hicimos pedimos el get()
            const searchRes = await cityAxiosConfig.get();
            return searchRes.data.features.map((singlePlace) => {
                //- Cuando pongo dos {} significa que enviaré un objeto implicitamente.
                return {
                    id: singlePlace.id,
                    name: singlePlace.place_name,
                    length: singlePlace.center[0],
                    latitude: singlePlace.center[1]
                };
            });
        } catch (err) {
            console.log("No se encontraron ciudades.", err)
            return [];
        }
    };

    //- Receive latitude and length.
    async getWeather(lat, lon) {
        try {
            //- Instancia de axios con argumentos.
            let weatherAxiosConfig = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: {
                    ...this.paramsWeatherQuery,
                    lat,
                    lon
                }
            });
            const weatherRes = await weatherAxiosConfig.get();
            const {
                weather,
                main
            } = weatherRes.data;

            //- Extraemos información de la data y retornamos un ejemplo con desc, t°. t° min, t° max.
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }
        } catch (err) {
            console.log("No se encontraron datos del clima.", err)
        };
    };

    addCityHistory(place) {
        //- Prevenir duplicados. Método unshift agrega elementos al inicio del array.
        if (this.history.includes(place.toLocaleLowerCase())) {
            return;
        }
        //- Cortamos el array sólo para mostrar los 5 primeros => splice(start, end);
        this.history = this.history.splice(0, 4);

        this.history.unshift(place.toLocaleLowerCase());

        //- Grabar en un archivo de texto.
        this.saveDatabase();
    };

    saveDatabase() {
        let payload = {
            history: this.history,
        }
        // Convertimos el array a JSON y lo guardamos con el path ./db/database.json
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    };

    readDataBase() {
        if (!fs.existsSync(this.dbPath)) return;
        let readData = fs.readFileSync(this.dbPath, {
            encoding: 'utf-8'
        });
        let dataRes = JSON.parse(readData);

        this.history = dataRes.history;
    };

}

module.exports = SearchData;
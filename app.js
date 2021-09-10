require('dotenv').config();
require('colors');

const {
    readInput,
    inquirerPrimaryMenu,
    confirmMenu,
    listPlaces
} = require('./helpers/inquirer');
const SearchData = require('./models/searchClass');

const main = async () => {
    let searchClass = new SearchData();
    let optionValue;

    do {
        optionValue = await inquirerPrimaryMenu();
        switch (optionValue) {
            case 1:
                //- Obtener data a partir de un input y pasarlo como parámetro a propiedad de clase.
                const cityData = await readInput("Introduzca la ciudad a buscar: ");
                const placesArray = await searchClass.cityTask(cityData);

                //- Listar lugares de acuerdo a la búsqueda.
                const idSelected = await listPlaces(placesArray);
                //- Si ponemos 0 continúa el ciclo.
                if (idSelected === 0) continue;

                //- Obtener objeto del lugar seleccionado. 
                const selectedPlaceArray = await placesArray.find((singlePlace) => singlePlace.id === idSelected);

                //- Guardar en base de datos local.
                searchClass.addCityHistory(selectedPlaceArray.name);

                //- Get weather
                const weatherInfo = await searchClass.getWeather(selectedPlaceArray.latitude, selectedPlaceArray.length);

                //- Mostrar información del lugar seleccionado.
                console.clear();
                console.log("\n=======================".red);
                console.log("Información de la ciudad".bold);
                console.log("=========================\n".red);
                console.log(`${">".red} Ciudad: ${(selectedPlaceArray.name).red}`);
                console.log(`${">".red} Latitud: ${selectedPlaceArray.length}`);
                console.log(`${">".red} Longitud: ${selectedPlaceArray.latitude}`);
                console.log(`${">".red} Temperatura: ${weatherInfo.temp}`);
                console.log(`${">".red} T° Mínima: ${weatherInfo.min}`);
                console.log(`${">".red} T° Máxima: ${weatherInfo.max}`);
                console.log(`${">".red} Clima: ${weatherInfo.desc}`);
                break;

            case 2:
                await searchClass.historyUpperFirst.forEach( (singlePlace, index) => {
                    let idx = `${index + 1}.`.red;
                    console.log(`${idx} ${singlePlace}`);
                })
                break;
        }
        if (optionValue !== 0) await confirmMenu();
    } while (optionValue !== 0);

    console.log("\n"+"[!]".red+" Hasta luego :)")
    console.log("[!]".red+" Desarrollado por "+"kl0q4i7o.".underline+"\n");

}

main();
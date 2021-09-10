require('colors');
const inquirer = require('inquirer');

//- Listado de opciones para la función principal. Se pone afuera para no gastar recursos en su creación.
const menuOpt = [{
    type: 'list',
    name: 'singleOpt',
    prefix: `${ '>>>'.red }`,
    message: `${"¿Qué desea hacer?".underline.red}`,
    choices: [
        {
            value: 1,
            name: ` ${ ('1' + '.').red } Buscar ciudad.`
        },
        {
            value: 2,
            name: ` ${ ('2' + '.').red } Historial.`
        },
        {
            value: 0,
            name: ` ${ ('0' + '.').red } Salir.`
        },
    ]
}];

//- Función principal.
const inquirerPrimaryMenu = async () => {
    console.clear();
    console.log("\n=====================".red);
    console.log("     Weather App     ".bold);
    console.log("=====================\n".red);

    const { singleOpt } = await inquirer.prompt(menuOpt);
    return singleOpt;
}

//- Función para leer input del lugar que el usuario busca.
const readInput = async ( msg ) => {
    
    let inputQuestion = {
        type: 'input',
        name: 'readDesc',
        prefix: `${ '>>>'.red }`,
        message: msg,
        validate( resValue ) {
            if (resValue.length === 0) {
                return 'Por favor ingresa un valor válido.'
            }
            return true;
        }
    };

    const { readDesc } = await inquirer.prompt(inputQuestion);
    return readDesc;

};

//- Funcion para mostrar opciones al usuario y elegir una.
const listPlaces = async (placesArray = []) => {
    const placesChoice = placesArray.map( ( singlePlace, index) => {
        let idx = `${index + 1}.`.red;
        
        //- Regresamos un nuevo Array.
        return {
            value: singlePlace.id,
            name: `${idx}${singlePlace.name}`
        }
    });

    placesChoice.unshift({
        value: 0,
        name: '0.'.red + ' Cancelar',
    })

    let choiceMenu = [
        {
            type: 'list',
            name: 'idSelected',
            prefix: `${ '>>>'.red }`,
            message: `${"Para continuar seleccione el lugar:".underline.red} `,
            choices: placesChoice,
        }
    ]

    const { idSelected } = await inquirer.prompt(choiceMenu);
    return idSelected;
} 

//- Función para confirmar pulsando enter.
const confirmMenu = async () => {
    const confirmQuestion = [{
        type: 'input',
        name: 'confirmDisplay',
        prefix: ` ${ '>>>'.red } `,
        message: `Presionar ${ 'Enter'.red } para continuar`,
    }]
    console.log('\n')
    const {confirmDisplay} = await inquirer.prompt(confirmQuestion);
    return confirmDisplay;
}

module.exports = {
    readInput,
    inquirerPrimaryMenu,
    confirmMenu,
    listPlaces,
}
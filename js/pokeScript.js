$('#form1').on('submit', function (event) {  // Triggers function on form submit
    event.preventDefault();  // Prevents default form submit behavior
    $('.poke-container').empty();  // Clears pokemon list

    const regEx = /^[a-z0-9 ,.-]+$/;  // Regular expression, contains lower case a-z, 0-9, commas, periods, and dashes
    let names = $('#myModalPoke input[type=text]').val().replace(/\./g, '').toLowerCase();   // Declaring name variable, gets input from form, removes periods, and changes text input to lower case
    if (regEx.test(names) === true ) {   // Validates input against regEx, if True executes code, else shows error text
        names = names.split(',');   // Sorts input into array at each comma

        $('div#error').empty();  // Clears error text
        names.map(function (name) {
            $('#loading-image').show();
            name = name.trim().replace(/\s/g, '-');  // Removes white space at beginning and end, replaces spaces in middle of text with dashes
            return $.ajax({
                url: 'https://pokeapi.co/api/v2/pokemon/' + name,   // API url, appends input to url
                dataType: 'json',
                method: 'GET',
                success: function () {   // Executes on successful data fetch
                    let pokemonNames = Array.prototype.slice.call(arguments);  //
                    pokemonNames = pokemonNames[0];
                    displayPokemon(pokemonNames)
                },
                error: function (error) {  // Executes on failed data fetch, displayPokemonError adds placeholder image for pokemon, shows error information.
                    displayPokemonError(name, error);
                },
                complete: function () {   // Hides loading information on completed ajax fetch.
                    $('#loading-image').hide();
                }
            });
        });
        this.reset()   // Resets input field.
    } else {
        $('div#error').html('Error! Please input a valid pokemon name or number. Only A-Z, 0-9, or ,.-! Example Pokemon: Bulbasaur, Charmander, Ivysaur.')
    }

});

function displayPokemon(pokemon) {  // Generates pokemon column on page.
    const $container = $('<div>').addClass('pokemon').addClass('row').addClass('alert').addClass('alert-primary');
    const $title = $('<h2>').text(pokeToUppercase(pokemon.name)).addClass('col-md-2').addClass('align-middle');
    const $image = $('<img alt="Pokemon" src="">').attr('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png').addClass('col-md-2');
    const $height = $('<h3>').text('Height:' + decimetersToFeet(pokemon.height) + 'feet').addClass('col-md-2').addClass('align-middle');
    const $weight = $('<h3>').text('Weight:' + hectogramsToPounds(pokemon.weight) + 'pounds').addClass('col-md-3').addClass('align-middle');
    const $types = $('<h3>').text('Types:' + getTypes(pokemon.types)).addClass('col-md-3').addClass('align-middle');
    $container.append($image, $title, $height, $weight, $types);
    $('.poke-container').append($container);
}

function displayPokemonError(name, error) {   // Generates error column on page.
    const $container = $('<div>').addClass('pokemon').addClass('row').addClass('alert').addClass('alert-primary');
    const $title = $('<h2>').text(name).addClass('col-md-2').addClass('align-middle');
    const $image = $('<img alt="404" src="img/404.png">').addClass('col-md-2');

    const $errorText = $('<h3>').text('Error loading pokemon.').addClass('col-md-5').addClass('align-middle');
    const $errorInfo = $('<h3>').text('Error: ' + error.responseText).addClass('col-md-3').addClass('align-middle');
    $container.append($image,$title, $errorText,$errorInfo);
    $('.poke-container').append($container);
}

function getTypes(types) {   // Since pokemon can have one or two types, determines if it has one or two and returns type.
    if (types.length === 2) {
        return pokeToUppercase(types[0].type.name) + '/' + pokeToUppercase(types[1].type.name);
    } else {
        return pokeToUppercase(types[0].type.name);
    }
}


function hectogramsToPounds(hecto) {  // Convers hectograms to pounds, and rounds to 2 decimals, if needed.
    return Math.round((hecto / 4.536) * 100) / 100
}

function decimetersToFeet(deci) {  // Converts decimeters to feet, and rounds to 2 decimals, if needed.
    return Math.round((deci / 3.048) * 100) / 100
}

function pokeToUppercase(string) {   // Sets first character in string to uppercase.
    return string.charAt(0).toUpperCase() + string.slice(1);
}


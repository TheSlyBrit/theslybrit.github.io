const logContainer = document.getElementById('container-log');
const inventoryContainer = document.getElementById('container-inventory');
const locationsContainer = document.getElementById('container-locations')
const buttonContainer = document.getElementById('container-buttons');
const scrapItemClass = { name:"Scrap", quantity: 1, usable: false };
const testItemClass = { name:"Test Item", quantity: 1, usable: true };
const ship = 
{
	locations:
	[
		{ name:"Fabricator" }, { name:"Cockpit" }
	],
}

let inventory = 
[
	{ name:"Test Item", quantity: 1, usable: true }
];

let locale = ship;

let intro = 
{ 
	stage: 0,
	story: 
	[ 
		{ 
			text: "You flick the switch to turn on the engine, producing satisfying click that cuts through the silence in the room and the tension in your body; a hard week of salvage work has come to an end.",
			action: "Set destination",
		},
		{
			text: "You punch in the co-ordinates of the nearest warp gate, checking over your manifest while you're on route. It's a pretty good haul, considering what little remained of the debris field.",
			action: "Go home",
			item:[ scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, scrapItemClass, ]
		},
		{
			text: "The ship lists slightly as you enter the warp gate, a sinking feeling filling your gut as space begins to bend around you.",
			action: "?",
		},
	],
}

function onLoad() {
	document.getElementById("tab-default").click();
	addButton( printIntro, "Boot up the engine", "intro_button");
	setInterval( gameLoop, 200);
}

function gameLoop() {
	inventory.forEach( updateInventoryWindow );
	locale.locations.forEach( updateLocationWindow );
}

function printIntro(){
	let button = document.getElementById( "intro_button");
	if( intro.stage >= intro.story.length ){
		intro.stage = intro.story.length;
		return;
	}
	
	button.textContent = intro.story[ intro.stage ].action;

	logMessage(intro.story[intro.stage].text);
	if( intro.story[ intro.stage ].item )
		for( let index = 0; index < intro.story[intro.stage].item.length; index++ )
			addItem( intro.story[ intro.stage ].item[ index] );
	intro.stage++;
}

function updateInventoryWindow( invObj ) {
	let index;
	let no_window = true;
	let window = document.querySelectorAll(".inventory-item, .inventory-item-usable");

	for( index = 0; index < window.length; index++ ){
		if( window[ index ].innerHTML.includes( invObj.name )){
			window[ index ].innerHTML = invObj.name + '\n' + invObj.quantity;
			no_window = false;
			if( invObj.quantity <= 0 ){
				window[ index ].remove();
				inventory.splice(inventory.indexOf(invObj), 1 );
			}
		}
	}

	if( no_window )
	{
		const entry = document.createElement('div');
		entry.className = 'inventory-item';
		if( invObj.usable ){
			entry.onclick = useItem;
			entry.className += '-usable';
		}
		entry.textContent = invObj.name + '\n' + invObj.quantity;
		inventoryContainer.appendChild(entry);
		if( invObj.pickuptext )
			logMessage(invObj.pickuptext, true );

	}
}

function updateLocationWindow( locObj ) {
	let index;
	let no_window = true;
	let window = document.getElementsByClassName('location');

	for( index = 0; index < window.length; index++ ){
		if( window[ index ].innerHTML.includes( locObj.name )){
			window[ index ].innerHTML = locObj.name;
				no_window = false;
		}
	}

	if( no_window )
	{
		const entry = document.createElement('div');
		entry.className = 'location';
		entry.textContent = locObj.name;
		locationsContainer.appendChild(entry);
		if( locObj.pickuptext )
			logMessage( locObj.pickuptext, { color: '#b19cd9'} );
	}
}

function logMessage(messageObj, special) {

	const entry = document.createElement('div');
	entry.className = 'log-entry';
	entry.textContent = messageObj;
	if( special )
		entry.style.backgroundColor = special.color;
	logContainer.appendChild(entry);
	logContainer.scrollTop = logContainer.scrollHeight;

}

function addItem( itemObj ) {
	let found_object = inventory.find(({name}) => name === itemObj.name );

	if( found_object ){
		found_object.quantity++;
	}
	else {
		inventory.push( itemObj );
	}
}

function useItem( evt )
{
	let item = inventory.find(({name})=> evt.currentTarget.textContent.includes( name ) )

	if( item )
		removeItem( item );
}

function removeItem( itemObj ) {
	let found_object = inventory.find(({name}) => name === itemObj.name);

	if( found_object )
		found_object.quantity--;
	else{
		logMessage("How are you using an item you don't have???", true );
	}
}

function addButton(input_func, input_text, input_id ) {
	//const cooldown = document.createElement('span');
	const button = document.createElement('button');
	//progress.className('button-entry-cooldown')
	button.className = 'button-entry';
	button.onclick = input_func;
	button.textContent = input_text;
	if( input_id )
		button.id = input_id;
	buttonContainer.appendChild( button );
}

function addMessage() {
	logMessage("TestLog");
}

function addScrap() {
	addItem({name:"Scrap", quantity:1});
}

function openLogTab(evt, tabName) {
	// Declare all variables
	let index, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("content-gameinfo");
	for ( index = 0; index < tabcontent.length; index++ ) {
		tabcontent[ index ].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("link-gameinfo");
	for ( index = 0; index < tablinks.length; index++ ) {
		tablinks[ index ].className = tablinks[ index ].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById( tabName ).style.display = "block";
	evt.currentTarget.className += " active";
}



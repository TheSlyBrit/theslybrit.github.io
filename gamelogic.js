const logContainer = document.getElementById('container-log');
const inventoryContainer = document.getElementById('container-inventory');
const buttonContainer = document.getElementById('container-buttons');

let TestItem1 = { name: "Jumpsuit", quantity: 1, pickuptext: "The jumpsuit is mundane, but comfortable."};
let TestItem2 = { name: "10mm Pistol", quantity: 1, pickuptext: "The pistol is cool to the touch, and suprisingly heavy."}
let inventory = [];
let intro = { 
	stage: 0,
	story: [ 
		{text:"Darkness...", action:"?"},
		{text:"Darkness..", action:"?"},
		{text:"Darkness.", action:"?"},
		{text:"Light?", action:"Wake up"},
		{text: "The blurs of colour in your vision snap into focus as you begin to wake.",action:"Open the cryopod"},
		{text:"Shivers of cold air flow out of the cryopod with a hiss as the door unseals.", action:"Look Around"},
		{text:`You definitely just died, and you've definitely never been in this room before.

Rows of pods stacked up to the roof span the length of the room, connected with pipes that trace the walls; presumably connected to the life support.`, action:"Search the Room" },
		{text: "You find a jumpsuit and a pistol", action: "?", item: [TestItem1, TestItem2] }
],
};

function onLoad() {
	document.getElementById("tab-default").click();
	addButton( printIntro, "?", "intro_button");
	setInterval( gameLoop, 200);
}

function gameLoop() {
	inventory.forEach( updateInventoryWindow );
}

function printIntro(){
	let button = document.getElementById( "intro_button");
	if( intro.stage >= intro.story.length ){
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
	let window = document.getElementsByClassName('inventory-item');

	for( index = 0; index < window.length; index++ ){
		if( window[ index ].innerHTML.includes( invObj.name )){
			window[ index ].innerHTML = invObj.name + '\n' + invObj.quantity;
				no_window = false;
		}
	}

	if( no_window )
	{
		const entry = document.createElement('div');
		entry.className = 'inventory-item';
		entry.textContent = invObj.name + '\n' + invObj.quantity;
		inventoryContainer.appendChild(entry);
		if( invObj.pickuptext )
			logMessage(invObj.pickuptext, true );
	}


}

function logMessage(messageObj, special) {

	const entry = document.createElement('div');
	entry.className = 'log-entry';
	entry.textContent = messageObj;
	if( special )
		entry.style.backgroundColor = '#b19cd9';
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

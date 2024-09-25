// Get storage variables that will need global scope
let savedEntries = localStorage.getItem('savedEntries');
if (!savedEntries) {
	savedEntries = localStorage.setItem('savedEntries', JSON.stringify([]))
}
savedEntries = JSON.parse(localStorage.getItem('savedEntries'));


// Check if URL has params
if (window.location.search) {
	
	const url = new URL(window.location.href);
	
	const entryID = url.searchParams.get('entryID');
	
	const subject       = document.querySelector('#subject');
	const date          = document.querySelector('#date');
	const entryTextarea = document.querySelector('#entry-text');
	
	subject.disabled = true;
	date.disabled = true;
	entryTextarea.disabled = true;
	
	for (let i = 0 ; i < savedEntries.length ; i++) {
		
		const currentEntry = savedEntries[i];
		
		if (currentEntry.id == entryID) {
			
			entryTextarea.value = currentEntry.txt;
			subject.value = currentEntry.subject;
			date.value = currentEntry.date;
			
		}
		
	}
	
	const editEntryButton = document.querySelector('#edit-entry');
	editEntryButton.style.display = 'block';
	
	let j = 0;
	editEntryButton.addEventListener('click', function() {
		j++;
		if (j % 2 === 0) {
			
			// Read mode
			editEntryButton.textContent = 'Edit Entry';
			entryTextarea.disabled = true;
			date.disabled          = true;
			subject.disabled       = true;
			
			for (let i = 0 ; i < savedEntries.length ; i++) {
		
				const currentEntry = savedEntries[i];
		
				if (currentEntry.id == entryID) {
					currentEntry.txt     = entryTextarea.value;
					currentEntry.date    = date.value;
					currentEntry.subject = subject.value;
					
					console.log(currentEntry);
					
					localStorage.setItem('savedEntries', JSON.stringify(savedEntries));
				}
		
			}

		} else {
			// Edit mode
			editEntryButton.textContent = 'Save Edits';
			entryTextarea.disabled = false;
			date.disabled          = false;
			subject.disabled       = false;
		}
		
	});
	
	const heading = document.querySelector('#write-an-entry');
	heading.textContent = 'Entry Reader';
	
	const addEntryButton = document.querySelector('#add-entry');
	addEntryButton.style.display = 'none';
	
}


// Load entry table display
let numOfEntriesToShow = 5;
loadEntriesTable(numOfEntriesToShow);



const addEntryButton = document.querySelector('#add-entry');
addEntryButton.addEventListener('click', function() {
	
	// Create entry object
	const date    = document.querySelector('#writing-space #entry-info #date').value;
	const txt     = document.querySelector('#writing-space #entry-text').value;
	let subject   = document.querySelector('#writing-space #entry-info #subject').value;
	
	// Tell user if they have left a field blank, 
	// if they do not confirm, break out of the function via return
	if (!date) {
		alert('You did not add a date! Please add one and try again.');
		return;
	} else if (!subject) {
		if (confirm('You did not add a subject! Proceed anyway?')) {
			subject = (subject) ? subject : '(No subject)'; 
			return;
		}
	} else if (!txt) {
		alert('You did not add any text! Please add some and try again.')
		return;
	} else {
		if (!confirm('Are you sure you want to add this entry?')) {
			return;
		}
	}
	
	
	// Get number of entries for creating new ID
	let numOfEntries = localStorage.getItem('numOfEntries');
	
	// if numOfEntries doesn't exist...
	if (numOfEntries === null) {
		console.log('numOfEntries is null');
		localStorage.setItem('numOfEntries', 0);
		numOfEntries = 0;
	} else {
		numOfEntries = parseInt(numOfEntries, 10);
	}
		
	const entryID = numOfEntries +1; // Increment it to make it unique
	
	localStorage.setItem('numOfEntries', entryID);
	
	// Construct entry object
	let entry = {
		id: entryID,
		date,
		subject,
		txt
	}

	// Save entry to savedEntries
	savedEntries.unshift(entry); // Need to put it to the front of the array
	
	localStorage.setItem('savedEntries', JSON.stringify(savedEntries));
	
});



function loadEntriesTable(numOfEntriesToShow=0) {
	
	if (savedEntries.length === 0) {
		
		const noEntriesMessage = document.querySelector('#no-entries');
		noEntriesMessage.style.display = 'block';
		
		const viewAllEntries = document.querySelector('#view-all-entries');
		viewAllEntries.style.display = 'none';
		
		const deleteAllEntries = document.querySelector('#delete-all-entries');
		deleteAllEntries.style.display = 'none';
		
		return;
	}
	
	// e.g., if 5 entries are requested but only 3 exist
	if (numOfEntriesToShow > savedEntries.length) {
		console.log('heyyy');
		numOfEntriesToShow = savedEntries.length;
	// If it is 0, that means load ALL entries
	} else if (numOfEntriesToShow === 0) {
		numOfEntriesToShow = savedEntries.length;
	}
	
	
	const allEntriesTable = document.querySelector('#all-entries');
	allEntriesTable.innerHTML = '';
	
	
	// Create head row if it doesn't exist already 
	// (In practice, runs only the first time the function is called)
	if (!document.querySelector('#header-row')) {
		
		// Create head row elements
	
		const headRow       = document.createElement('tr');
		const dateHeader    = document.createElement('th');
		const subjectHeader = document.createElement('th');
		const txtHeader     = document.createElement('th');
		const blankHeader   = document.createElement('th'); // For the X column
	
		headRow.id = 'header-row';
		dateHeader.textContent    = 'Date';
		subjectHeader.textContent = 'Subject';
		txtHeader.textContent     = 'Content';
	
		headRow.appendChild(dateHeader);
		headRow.appendChild(subjectHeader);
		headRow.appendChild(txtHeader);
		headRow.appendChild(blankHeader);
		
		allEntriesTable.appendChild(headRow);
		
	}
	
	// Load a display of all entries
	for (let i = 0 ; i < savedEntries.length ; i++) {
	
		const currentEntry = savedEntries[i];
	
		// Create <tr>, <td>s
		const tableRow   = document.createElement('tr');
		const dateTd     = document.createElement('td');
		const subjectTd  = document.createElement('td');
		const txtTd      = document.createElement('td');
		const delButton  = document.createElement('td');


		dateTd.innerHTML     = currentEntry.date;
		dateTd.classList.add('entry-link');
		subjectTd.innerHTML  = currentEntry.subject;
		txtTd.innerHTML      = currentEntry.txt;
		delButton.innerHTML  = 'x';
		delButton.classList.add('del-entry-button');
	
	
		// Append all <td>s to the <tr>
		tableRow.appendChild(dateTd);
		tableRow.appendChild(subjectTd);
		tableRow.appendChild(txtTd);
		tableRow.appendChild(delButton);
	
	
		// Add table row
		allEntriesTable.appendChild(tableRow);
	
	
		// If Subject text overflows, add a title attr and add the help-cursor class
		if (subjectTd.scrollWidth > subjectTd.clientWidth) {
		
			subjectTd.classList.add('help-cursor');
			subjectTd.title = currentEntry.subject;
		
		}
	
	
		// Add event listener to the Date <td> to read that entry
		dateTd.addEventListener('click', function() {
		
			console.log('Hello? (Line 112)');
		
			const baseURL = window.location.pathname;
			const param   = '?entryID=' + currentEntry.id;
		
			console.log(baseURL);
			console.log(param);
		
			window.location.href = baseURL + param;
		
		});
		
		delButton.addEventListener('click', function() {
			if (confirm('Are you sure you want to delete this entry from ' + currentEntry.date + 
			'? This action cannot be undone!')) {
				savedEntries.splice(i, 1);
				localStorage.setItem('savedEntries', JSON.stringify(savedEntries));
			}
		});
	
	}
	
	
	if (numOfEntriesToShow > 0) {
		// Hide the rows except for the number that needs to be shown (incl. the header <tr>
		const tableRowsToHide = document.querySelectorAll('#all-entries tr:nth-child(n+' + (numOfEntriesToShow + 2)
		+ ')'); // numOfEntriesToShow plus 2, to maker sure the header <tr> doesn't count as an entry
	
		//
		for (let i = 0 ; i < tableRowsToHide.length ; i++) { tableRowsToHide[i].style.display = 'none'; }
	}

}


const viewAllEntries = document.querySelector('#view-all-entries');
let j = 0;
viewAllEntries.addEventListener('click', function() {
	j++;
	if (j % 2 === 0) {
		viewAllEntries.textContent = 'View all...';
		loadEntriesTable(numOfEntriesToShow);
	} else if (j % 2 !== 0) {
		viewAllEntries.textContent = 'View less...';
		loadEntriesTable();
		console.log('Yoo-hoo!');
	}
	
});


const deleteAllEntries = document.querySelector('#delete-all-entries');
deleteAllEntries.addEventListener('click', function() {
	
	if (confirm('Are you sure you want to delete ALL of your entries? This action cannot be undone!')) {
		localStorage.setItem('savedEntries', JSON.stringify([]));
		localStorage.setItem('numOfEntries', 0);
	}
	
});



/* ===========
    FUNCTIONS
   =========== */

function retrieveStorageKey(keyName, valueIfNotExists) {
	
	let value = localStorage.getItem(keyName);
	
	// Runs if the key has not already been set
	if (value === null) {
		console.log('value null - line 7')
		localStorage.setItem(keyName, valueIfNotExists);
	}
	
	try {
		// See if the key is an array
		return JSON.parse(value);
	} catch (e) {
		return value;
	}
}


const entryTextarea = document.querySelector('#writing-space #entry-text');

function adjustEntryTextHeight() {
	entryTextarea.style.height = 'auto';
	entryTextarea.style.height = entryTextarea.scrollHeight + 'px';
}

document.addEventListener('input', adjustEntryTextHeight);
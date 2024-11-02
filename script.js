
let datasStatic = [];

// Store restore
// =========================================================
(function automaticRestoringFromLocalStorage() {
    if (localStorage.getItem('datas')) {
        // console.log('Restored:', JSON.parse(localStorage.getItem('datas')));
        datasStatic = JSON.parse(localStorage.getItem('datas'));
    }
})();

function storingToLocalStorage(datasToStore) {
    localStorage.setItem('datas', JSON.stringify(datasToStore));
}

// ========================================================
function userDisplayer(datas) {
    usersListLoader.classList.add('hidden');

    const usersGrid = document.querySelector('.users-grid-list');
    function clearAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };
    clearAllChildren(usersGrid);

    for (let i = 0; i < datas.length; i++) {
        const userInformations = document.createElement("div");
        userInformations.classList.add("user", "user-informations");

        // Create the user-profile container
        const userProfileContainer = document.createElement("div");
        userProfileContainer.classList.add("user-profile-container");

        // Create the user-profile picture container
        const userProfilePictureContainer = document.createElement("div");
        userProfilePictureContainer.classList.add("user-profile_picture-container");

        // Create the image element inside the profile picture container
        const profileImage = document.createElement("img");
        profileImage.setAttribute("width", "40px");
        profileImage.setAttribute("src", datas[i].picture.thumbnail);
        profileImage.setAttribute("alt", "profile picture of ${zozo}");
        profileImage.classList.add("user-profile_picture-container");

        // Append the image to the profile picture container
        userProfilePictureContainer.appendChild(profileImage);

        // Create the user-name paragraph
        const userName = document.createElement("p");
        userName.classList.add("user-name");

        // Create the user-last name span
        const lastNameSpan = document.createElement("span");
        lastNameSpan.classList.add("user-last_name");
        lastNameSpan.textContent = datas[i].name.last + " ";

        // Create the user-first name span
        const firstNameSpan = document.createElement("span");
        firstNameSpan.classList.add("user-first_name");
        firstNameSpan.textContent = " " + datas[i].name.first;

        // Append last name and first name spans to the user-name paragraph
        userName.appendChild(lastNameSpan);
        userName.appendChild(firstNameSpan);

        // Append the user-name paragraph and the profile picture container to the user-profile container
        userProfileContainer.appendChild(userProfilePictureContainer);
        userProfileContainer.appendChild(userName);

        // Create the users-email container
        const emailContainer = document.createElement("div");
        emailContainer.classList.add("users-email-container");

        // Create the email paragraph and add text content
        const emailParagraph = document.createElement("p");
        emailParagraph.textContent = datas[i].email;

        // Append the email paragraph to the email container
        emailContainer.appendChild(emailParagraph);

        // Create the users-phone number container
        const phoneNumberContainer = document.createElement("div");
        phoneNumberContainer.classList.add("users-phone_number-container");

        // Create the phone number paragraph and add text content
        const phoneParagraph = document.createElement("p");
        phoneParagraph.textContent = datas[i].phone;

        // Append the phone number paragraph to the phone number container
        phoneNumberContainer.appendChild(phoneParagraph);

        // Append everything to the main user div
        userInformations.appendChild(userProfileContainer);
        userInformations.appendChild(emailContainer);
        userInformations.appendChild(phoneNumberContainer);

        // Finally, append the userInformations to the body or another container in the DOM
        usersGrid.appendChild(userInformations);
    }
};
// userDisplayer(datasStatic)

// Fetch
// =========================================================
const usersListLoader = document.getElementById('loading');
function usersFetcher() {
    usersListLoader.classList.remove('hidden');
    fetch('https://randomuser.me/api/?nat=fr&results=50')
        .then((response) => response.json())
        .then((data) => {
            // console.log(data.results);
            storingToLocalStorage(data.results);
            datasStatic = data.results;
            userDisplayer(data.results);
        })
        .catch((error) => console.log(error))
};
usersFetcher();

// filter
// ========================================================

const usersFilters = document.querySelectorAll('.users-filters');
usersFilters.forEach((filter) => {
    // filter.addEventListener('click', filtersHandler);
    filter.addEventListener('click', (e) => {
        const filter = e.target;
        const filterName = filter.id.slice(18, filter.id.length);
        const order = filter.dataset.sortBy;
        switch (filterName) {
            case "name":
                usersListSortingByName(filter, filterName, order)
                break;
            case "email":
                usersListSorting(filter, filterName, order);
                break;
            case "phone":
                usersListSorting(filter, filterName, order);
                break;
            default:
                console.log("Unknown category");
        }
    });
});

function usersListSorting(filter, filterName, order) {
    let dataSorted = [];
    if (order === 'ascending') {
        dataSorted = datasStatic.sort((a, b) => {
            return a[filterName].localeCompare(b[filterName]);
        });
        filter.dataset.sortBy = "descending";
    } else {
        dataSorted = datasStatic.sort((a, b) => {
            return b[filterName].localeCompare(a[filterName]);
        });
        filter.dataset.sortBy = "ascending";
    }
    userDisplayer(dataSorted);
}

function usersListSortingByName(filter, filterName, order) {

    let dataSorted = [];
    if (order === 'ascending') {
        dataSorted = datasStatic.sort((a, b) => {
            return a[filterName].last.localeCompare(b[filterName].last);
        });
        filter.dataset.sortBy = "descending";
    } else {
        dataSorted = datasStatic.sort((a, b) => {
            return b[filterName].last.localeCompare(a[filterName].last);
        });
        filter.dataset.sortBy = "ascending";
    }
    userDisplayer(dataSorted);
}

// Search
// =======================================================
const usersSearchBar = document.getElementById('users-search_bar-input');
usersSearchBar.addEventListener('input', usersSearchBarHandler);
// function cleanString(str) {
//     const replacements = {
//       'ç': 'c',
//       'ö': 'o',
//       'ü': 'u',
//       'é': 'e',
//       'è': 'e',
//       'ê': 'e',
//       'â': 'a',
//       'ä': 'a',
//       'ã': 'a',
//       'å': 'a',
//       'î': 'i',
//       'í': 'i',
//       'ï': 'i',
//       'ô': 'o',
//       'ñ': 'n',
//     };

//   return str.split('').map(char => replacements[char] || char).join('');
// }  
// let valueOneCleansed = cleanString(searchInput.value.split(' ')[0]);
// let valueTwoCleansed = cleanString(searchInput.value.split(' ')[1]);

function usersSearchBarHandler(event) {
    const searchInput = event.target;
    let dataFiltered = datasStatic.filter((el) => {
        //  el.name.last.includes(event.target.value) 
        // If there is at least one space (so the split is trigered) and one more char (so the second elements of the array is not a blank space)
        if (searchInput.value.split(' ').length == 2 && searchInput.value.split(' ')[1].length > 0) {

            //   DIDN'T WORK  // If lastName include search.value[0] or [1], AND lastName include search.value[0] or [1] didn't work...
            //   DIDN'T WORK    // if(el.name.last.toLowerCase().includes(searchInput.value.split(' ')[0].toLowerCase()) || el.name.last.toLowerCase().includes(searchInput.value.split(' ')[1].toLowerCase()) && el.name.first.toLowerCase().includes(searchInput.value.split(' ')[0].toLowerCase()) || el.name.first.toLowerCase().includes(searchInput.value.split(' ')[1].toLowerCase())){

            // If lastName include search.value[0] and firstName  include search.value[1]
            if (el.name.last.toLowerCase().includes(searchInput.value.split(' ')[0].toLowerCase()) && el.name.first.toLowerCase().includes(searchInput.value.split(' ')[1].toLowerCase())) {
                return el
                // Else If lastName include search.value[1] and firstName  include search.value[0]
            } else if (el.name.last.toLowerCase().includes(searchInput.value.split(' ')[1].toLowerCase()) && el.name.first.toLowerCase().includes(searchInput.value.split(' ')[0].toLowerCase())) {
                return el
            }
        } else {

            // If lastName OR first name include search.value, trigger
            if (el.name.last.toLowerCase().includes(searchInput.value.split(' ')[0].toLowerCase()) || el.name.first.toLowerCase().includes(searchInput.value.split(' ')[0].toLowerCase())) {
                // return el.name.last.toLowerCase().includes(searchInput.value.toLowerCase())
                return el
            }
        }
    });
    userDisplayer(dataFiltered);
}



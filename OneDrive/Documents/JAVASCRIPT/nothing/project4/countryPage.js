const countryName = new URLSearchParams(window.location.search).get("name")
console.log(countryName)
const countryFlag = document.querySelector(".countryInformation img")
const countryTitle = document.querySelector(".countryTitle")
const countryDetails = document.querySelector(".countryDetails")
const nativeName = document.querySelector(".nativeName span")
const population = document.querySelector(".population span")
const region = document.querySelector(".region span")
const subRegion = document.querySelector(".subRegion span")
const capital = document.querySelector(".capital span")
const topLevelDomain = document.querySelector(".topLevelDomain span")
const currencies = document.querySelector(".currencies span")
const languages = document.querySelector(".languages span")
const borderCountries = document.querySelector(".borderCountries")
const themeChanger = document.querySelector(".themeChanger")

function applyDarkMode() {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
        themeChanger.innerHTML = `<i class="fa-solid fa-sun"></i> Light Mode`;
    } else {
        document.body.classList.remove("dark");
        themeChanger.innerHTML = `<i class="fa-solid fa-moon"></i> Dark Mode`;
    }
}

applyDarkMode()

themeChanger.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        localStorage.setItem("darkMode", "disabled");
    } else {
        document.body.classList.add("dark");
        localStorage.setItem("darkMode", "enabled");
    }
    applyDarkMode();
});

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`).then((response) => response.json())
    .then(([country]) => {
        // console.log(country)
        countryFlag.src = country.flags.svg
        countryTitle.innerText = country.name.common
        if (country.name.nativeName) {
            nativeName.innerText = Object.values(country.name.nativeName)[0].common
        }
        population.innerText = country.population
        region.innerText = country.region
        if (country.subregion) {
            subRegion.innerText = country.subregion
        }
        if (country.capital) {
            capital.innerText = country.capital[0]
        }
        if(country.tld[0]) {
            topLevelDomain.innerText = country.tld[0]
        }
        if(country.currencies) {
            currencies.innerText = Object.values(country.currencies)?.[0].name
        }
        if(country.languages) {
            languages.innerText = Object.values(country.languages).join(", ")
        }

        if (country.borders) {
            country.borders.forEach((border) => {
                fetch(`https://restcountries.com/v3.1/alpha/${border}`).then((response) => response.json())
                    .then(([borderCountry]) => {
                        // console.log(borderCountry)
                        const borderCountryTags = document.createElement("a")
                        borderCountryTags.innerText = borderCountry.name.common
                        borderCountryTags.href = `countryPage.html?name=${borderCountry.name.common}`
                        console.log(borderCountryTags)
                        borderCountries.appendChild(borderCountryTags)
                    })
            })
        }
    })
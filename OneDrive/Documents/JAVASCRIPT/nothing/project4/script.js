const cardsContainer = document.querySelector(".cardsContainer")
const selectByRegions = document.querySelector("#select")
const inputSearch = document.querySelector(".inputSearch input")
const themeChanger = document.querySelector(".themeChanger")

function applyDarkMode() {
    if(localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark")
        themeChanger.innerHTML = `<i class="fa-solid fa-sun"></i> Light Mode`
    } else {
        document.body.classList.remove("dark")
        themeChanger.innerHTML = `<i class="fa-solid fa-moon"></i> Dark Mode`
    }
}
applyDarkMode()

themeChanger.addEventListener("click", () => {
    console.log(themeChanger.innerHTML)
    document.body.classList.toggle("dark")
    console.log(document.body.classList)
    if(document.body.classList.contains("dark")) {
        document.body.classList.remove("dark")
        localStorage.setItem("darkMode", "enabled")
    }else {
        document.body.classList.add("dark")
        localStorage.setItem("darkMode", "disabled")
    }
    applyDarkMode()
})

let renderCountries = (data) => {
    cardsContainer.innerHTML = ""
    data.forEach((country) => {
        // console.log(country.flags)
        const card = document.createElement("a");
        card.classList.add("card")
        card.href = `/countryPage.html?name=${country.name.common}`

        card.innerHTML = `
            <img src="${country.flags.svg}" alt="">
            <div class="cardContent">
                <h3 class="cardTitle">${country.name.common}</h3>
                <p><b>Population: </b><span>${country.population.toLocaleString("en-IN")}</span></p>
                <p><b>Region: </b><span>${country.region}</span></p>
                <p><b>Capital: </b><span>${country.capital}</span></p>
            </div>
`
        cardsContainer.appendChild(card)
    })
}

fetch("https://restcountries.com/v3.1/all").then((resolve) => resolve.json())
    .then((data) => {
        renderCountries(data)
        allCountriesData = data
    })

selectByRegions.addEventListener("change", (e) => {
    console.log(e.target.value)
    fetch(`https://restcountries.com/v3.1/region/${e.target.value}`).then((response) => response.json())
    .then((renderCountries))
})

inputSearch.addEventListener("input", (e) => {
    const filteredCountryData = allCountriesData.filter((countryData) => countryData.name.common.toLowerCase().includes(e.target.value.toLowerCase()))
    renderCountries(filteredCountryData)
})



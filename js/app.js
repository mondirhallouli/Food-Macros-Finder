const form = document.querySelector('form');
const wrapper = document.querySelector('.post-wrapper'); // search results main wrapper

// API INFO / request URL
const appId = "3bcaf9ea";
const appKey = "698406f0c7a00ca67bb96c9968255a35";


const handlePosts = (resource) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
      if(request.readyState === 4 && request.status === 200) {
        const data = JSON.parse(request.responseText);
        resolve(data);
      } else if(request.readyState === 4) {
        reject('failed getting data, try again!');
      }
    });
    request.open('GET', resource);
    request.send();
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  wrapper.innerHTML = "";
  const keyword = form.search.value;
  const requestUrl = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${keyword}&nutrition-type=logging`;

  handlePosts(requestUrl)
  .then(data => {
    console.log(data);

    if(data.hints.length === 0) {
      const errOut = `<p class="error-output">Food not found...</p>`;
      wrapper.innerHTML = errOut;
    }

    data.hints.forEach(hint => {
      const content = `
        <div class="card">
          <div class="card-img">
            <img src=${hint.food.image} alt="product image"/>
          </div>
          <h3 class="card-title">${hint.food.label}</h3>
          <div class="card-info">
            <div class="info-bar">
              <p class="info-name">Calories </p>
              <p class="info-val">${Math.floor(hint.food.nutrients.ENERC_KCAL)} <em>kcal</em></p>
            </div>
            <div class="info-bar">
              <p class="info-name">Carbohydrates </p>
              <p class="info-val">${Math.floor(hint.food.nutrients.CHOCDF)} <em>g</em></p>
            </div>
            <div class="info-bar">
              <p class="info-name">Fats </p>
              <p class="info-val">${Math.floor(hint.food.nutrients.FAT)} <em>g</em></p>
            </div>
            <div class="info-bar">
              <p class="info-name">Protein </p>
              <p class="info-val">${Math.floor(hint.food.nutrients.PROCNT)} <em>g</em></p>
            </div>
            <div class="info-bar">
              <p class="info-name">Fibers </p>
              <p class="info-val">${Math.floor(hint.food.nutrients.FIBTG)} <em>g</em></p>
            </div>
          </div>
        </div>
      `;

      wrapper.innerHTML += content;
    });
  })
  .catch(error => console.log(error));

  form.reset();
});

/*
CHOCDF => CARBS -> g
ENERC_KCAL => ENERGY -> kcal
FAT => FAT -> g
FIBTG => FIBERS -> g
PROCNT => PROTEIN -> g
*/ 
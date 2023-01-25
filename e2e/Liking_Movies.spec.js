const assert = require('assert');

Feature('Liking Movies');

Before(({ I }) => {
  I.amOnPage('/#/like');
});

Scenario('liking one movie', async ({ I }) => {
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

  I.amOnPage('/');
  I.waitForElement('.movie__title a');

  const firstFilm = locate('.movie__title a').first();
  const firstFilmTitle = await I.grabTextFrom(firstFilm);
  I.click(firstFilm);
  I.click('#likeButton');

  I.amOnPage('/#/like');
  I.seeElement('.movie-item');
  const likedMovieTitle = await I.grabTextFrom(locate('.movie__title'));

  assert.strictEqual(firstFilmTitle, likedMovieTitle);
});

Scenario('searching a movie', async ({ I }) => {
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

  I.amOnPage('/');
  I.waitForElement('.movie__title a');

  const titles = [];

  for (let i = 1; i <= 3; i += 1) {
    I.click(locate('.movie__title a').at(i));
    I.waitForElement('#likeButton');
    I.click('#likeButton');
    titles.push(await I.grabTextFrom('.movie__title'));
    I.amOnPage('/');
  }

  I.amOnPage('/#/like');
  const searchQuery = titles[1].substring(1, 3);
  const matchingFilms = titles.filter((title) => title.includes(searchQuery));

  I.fillField('#query', searchQuery);
  I.pressKey('Enter');

  const visibleLikedMovies = await I.grabNumberOfVisibleElements('.movie-item');
  assert.strictEqual(matchingFilms.length, visibleLikedMovies);

  matchingFilms.forEach(async (title, index) => {
    const visibleTitle = await I.grabTextFrom(locate('.movie__title a').at(index + 1));
    assert.strictEqual(title, visibleTitle);
  });
});

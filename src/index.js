import './css/style.css'

import jQuery from 'jquery'
import albumResult from './templates/album-result.html'
import modal from './templates/modal.html'

const $ = jQuery

let selectedArtist = {}
let timeoutId = null
let listArtist = []
let leftAlbumsToBeLoaded = []

let listArtistElem = $('.list-artist')
let listAlbumElem = $('.list-albums')

$.get('http://localhost:3000/artists', response => {
  listArtist = response
})

// Search artist input text box
$('.search-bar__input').keyup(function () {
  let artistName = ''
  let searchedValue = $(this).val().trim()
  listArtistElem.html('')

  clearTimeout(timeoutId)

  timeoutId = setTimeout(() => {
    listArtist.map(artist => {
      artistName = artist.name

      if (artistName.startsWith(searchedValue)) {
        listArtistElem.append(
          $('<li></li>')
            .data('id', artist)
            .text(artist.name)
        )
      }

      if (searchedValue === '') {
        listArtistElem.html('')
      }
    })
  }, 500)
})

// Select artist and load its albums
$('body').on('click', '.list-artist li', function () {
  selectedArtist = $(this).data('id')

  let albumTemplate = $(albumResult)
  let albumTemplateCopy = {}
  let nElement = ''

  listArtistElem.html('')
  listAlbumElem.html('')

  $.get('http://localhost:3000/artists/' + selectedArtist.id + '/discography', response => {
    response.discography.map(function (album, index) {
      albumTemplateCopy = albumTemplate.clone()

      albumTemplateCopy.find('.list-albums__item__image').attr('src', album.cover_url)
      albumTemplateCopy.find('.list-albums__item__name').text(album.title)
      albumTemplateCopy.find('.list-albums__item__year').text(album.release_year)

      nElement = $('<li></li>')
        .data('album', album)
        .append(albumTemplateCopy.html())

      if (index > 4) {
        $('.btn-load').fadeIn()
        leftAlbumsToBeLoaded.push(nElement)
      } else {
        listAlbumElem.append(
          nElement
        )
      }
    })
  })
})

// Select artist album and load modal with album information
$('body').on('click', '.list-albums li', function () {
  let modalTemplate = $(modal).clone()
  let selectedAlbum = $(this).data('album')

  modalTemplate.find('.modal__container__image').attr('src', selectedAlbum.cover_url)
  modalTemplate.find('.modal__container__info__artist').text(selectedArtist.name)
  modalTemplate.find('.modal__container__info__album').text(selectedAlbum.title)
  modalTemplate.find('.modal__container__info__year').text(selectedAlbum.release_year)
  modalTemplate.find('.modal__container__info__description').text(selectedAlbum.info)

  $('body').prepend(modalTemplate)
  $('html, body').animate({scrollTop: 0}, 500)
})

// Close modal
$('body').on('click', '.modal__container__close, .modal__layer', function () {
  $('.modal').remove()
})

// Load more albums from artist
$('.btn-load').click(function () {
  $('.btn-load').hide()
  $('.loader').show()

  let albumsToBeLoaded = leftAlbumsToBeLoaded

  if (leftAlbumsToBeLoaded.length > 3) {
    albumsToBeLoaded = leftAlbumsToBeLoaded.splice(0, 3)
  } else {
    leftAlbumsToBeLoaded = []
  }

  setTimeout(() => {
    albumsToBeLoaded.map(function (album) {
      $('.list-albums').append(album)
    })

    // setting button and loader icons state
    $('.loader').hide()
    if (leftAlbumsToBeLoaded.length > 0) {
      $(this).show()
    }
  }, 500)
})

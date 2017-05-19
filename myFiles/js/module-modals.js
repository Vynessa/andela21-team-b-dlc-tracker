$(document).ready(() => {
  $(".click-card").on('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    webwindow.init().openWindow('window-1', 'Javascript Community');
  });
 $('.modal-trigger').leanModal();
  });



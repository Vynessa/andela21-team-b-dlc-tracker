const webwindow = new (class WebWindow {
  init() {
    this.rootWindow = WebWindow.createContainer();
    this.minimizedWindows = [];
    return this;
  }

  static createContainer() {
    // create div element that holds all windows
    const windowContainer = document.createElement('div');
    windowContainer.id = 'webwindow-window-container';
    // hide element by default
    windowContainer.className = "webwindow-hide";
    document.getElementById("tl-design-template").appendChild(windowContainer);
    return windowContainer;
  }

  get minimizedWindowsCount() {
    // return count of all minimized windows
    return this.minimizedWindows.length;
  }


  get windowLayout() {
    //layout of a window instance  
    return `<div class = "webwindow-window-bar">
    <span class = "webwindow-window-title">:title</span>
    <i class="fa fa-window-restore"></i>
    <i class="fa fa-window-close"></i></div>
    <div class ="webwindow-window-content">
    <div style="width: 40%; float: left; border-right: 2px solid black;">
     <ul id="profile-page-about-details" class="collection z-depth-1">
                  <li class="collection-item">
                    <div class="row">
                      <div class="col s7 grey-text text-darken-4 style="text-align: center;">
                      Introduction to Javascript
                      <br />
                      <a class="waves-effect waves-light btn" id="tutorialz">Take Tutorial</a></div>
                    </div>
                  </li>
                </ul>

  <ul id="profile-page-about-details" class="collection z-depth-1">
                  <li class="collection-item">
                    <div class="row">
                      <div class="col s7 grey-text text-darken-4 style="text-align: center;">Video Course</div>
                      <iframe width="100%" height="200" src="https://www.youtube.com/embed/6MaOPdQPvow" frameborder="0" allowfullscreen></iframe>
                    </div>
                  </li>
                </ul>
         <ul id="profile-page-about-details" class="collection z-depth-1">
                  <li class="collection-item">
                    <div class="row">
                      <div class="col s7 grey-text text-darken-4 style="text-align: center;"><a class="waves-effect waves-light btn">Take assessment</a></div>
                    </div>
                  </li>
                </ul>
    </div></div>
    <div id="views" style="width: 60%; float: right; border-right: 2px solid black;">

    </div>
    </div>`
  }

  get windowCount() {
    // return count of all windows excluding terminals
    return this.rootWindow.getElementsByClassName("webwindow-window").length;
  }

  getWindow(windowId) {
    return this.rootWindow.getElementById(windowId);
  }

  createWindow(windowId, title, classes) {
    // a window is a div element
    const defaultClasses = "webwindow-window";
    const newWindow = document.createElement('div');
    newWindow.tabIndex = "-1";
    newWindow.id = windowId;
    newWindow.className = (classes)?`${classes} ${defaultClasses}` : `${defaultClasses}`;
    //get window layout, replace title placeholder(:title)
    //the window layout is the foundation of a window 
    newWindow.innerHTML = compileDomString(this.windowLayout, {'title': title});
    return newWindow;
  }

  windowIsTerminal(newWindow, parent) {
    /*a terminal is a window opened in another window;
    every non terminal can open a terminal*/
    newWindow.classList.toggle('webwindow-terminal');
    /*remove restore button, a terminal window cannot be restored down*/
    newWindow.getElementsByClassName('fa fa-window-restore')[0].remove();
    return parent;
  }

  openWindow(windowId, title, classes, parent = 'root') {
    const newWindow = this.createWindow(windowId, title, classes);
    const parentWebWindow = (parent === 'root') ?
    this.rootWindow : this.windowIsTerminal(newWindow, parent);
    parentWebWindow.appendChild(newWindow);
    this.windowEvents(newWindow);
    newWindow.focus();
    if (this.rootWindow.classList.contains('webwindow-hide')) {
      this.rootWindow.classList.toggle('webwindow-hide');
    }

    return newWindow;
  }

  windowEvents(newWindow) {
    newWindow.addEventListener('click', (evt) => {
      evt.stopPropagation();
      const clickedElement = evt.target;
      if (clickedElement.className === 'fa fa-window-close') {
        this.closeWindow(newWindow);
      } else if (clickedElement.className === 'fa fa-window-restore') {
        this.restoreWindow(newWindow);
      }
    });
  }

  closeWindow(windowElem) {
    if (windowElem.classList.contains('webwindow-min')) {
      this.deleteMinWindow(windowElem);
      this.rePositionMinWindows();
    }
    windowElem.remove();
    if(!this.windowCount) {this.rootWindow.classList.toggle("webwindow-hide")};
  }

  deleteMinWindow(windowElem) {
    const elemIndex = Array.prototype.indexOf.call(this.minimizedWindows, windowElem);
    if (elemIndex !== -1) {
      Array.prototype.splice.call(this.minimizedWindows, elemIndex, 1);
    }
  }

  rePositionMinWindows() {
    Array.prototype.forEach.call(this.minimizedWindows, (elem, elemIndex) => {
      const expectedLeftPosition = 5+(18*elemIndex);
      if (parseInt(elem.style.left) > expectedLeftPosition) {
        elem.style.left = `${expectedLeftPosition}%`;
      }
    });
  }

  adjustStackLevel(windowElem) {
    windowElem.style.zIndex = `${10 * (this.windowCount - this.minimizedWindowsCount)}`;
  }

  restoreWindow(windowElem) {
    if (windowElem.classList.toggle("webwindow-min")) {
      windowElem.style.left = `${5+(18*this.minimizedWindowsCount)}%`
      Array.prototype.push.call(this.minimizedWindows, windowElem);
    } else {
      this.deleteMinWindow(windowElem);
      windowElem.style.left = '';
      this.adjustStackLevel(windowElem);
      this.rePositionMinWindows();
    }
  }

  closeAllWindows() {
    Array.prototype.forEach.call(this.rootWindow.children, (child) => {
      child.remove();
    });
    this.minimizedWindows = [];
  }

})();
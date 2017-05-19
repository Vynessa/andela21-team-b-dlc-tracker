angular.module('dlctrackerApp')
.directive('moduleTest', () => {
  return {
    restrict: 'E',
    controller: 'appCtrl',
    template: `<div class = 'test-div' ng-repeat = 'question in modules.assessment'>
    <div class = 'question-div'>{{question.question}}</div>
    <input ng-repeat = 'option in question.options' type = 'radio' name = 'test', value = {{option}}>
    {{option}}
    </div>`
  };
})
.directive('learningModule', () => {
  return {
    restrict: 'E',
    controller: 'appCtrl',
    template: `<div>
    <video class = 'module-video' width="320" height="240" controls>
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.ogg" type="video/ogg">
    Your browser does not support the video tag.
    </video>
    <div class = 'module-text'></div>
    <module-test></module-test>
    </div>`
  };
})
.directive('userInCommunity', () => {
  return {
    restrict: 'E',
    scope: {
      commname: '=',
      usercomm: '=',
    },
    template: `
    <p>Active: <i ng-show = 'usercomm.active' class="fa fa-check" aria-hidden="true"></i>
    <i ng-show = '!usercomm.active' class="fa fa-times" aria-hidden="true"></i></p>
    <p>Completed: <i ng-show = 'usercomm.completed' class="fa fa-check" aria-hidden="true"></i>
    <i ng-show = '!usercomm.completed' class="fa fa-times" aria-hidden="true"></i></p>
    <p> Total modules: <b>{{usercomm.totalModules}}</b></p>
    <p> Completed modules: <b>{{usercomm.completedModules}}</b></p>
    <div class="progress">
    <div class="determinate" style="width: {{usercomm.completedModules/usercomm.totalModules*100}}%">{{usercomm.completedModules/usercomm.totalModules*100}}%</div>   
    </div>`
  }
})
.directive('adminInCommunity', () => {
  return {
    restrict: 'E',
    scope: {
      comm: '=',
      moduleslength: '=',
    },
    template: `
    <p><i class="mdi-action-history"></i> {{comm.estimatedTime}} hours</p>
    <p><i class="mdi-action-perm-identity"></i> {{comm.studentsCount}} students enrolled</p>
    <p><i class="mdi-action-wallet-travel"></i> {{moduleslength}} modules</p>`
  }
})
.directive('modalClick', () => {
  const link = function link(scope, elem, attrs) {
    elem.on('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      webwindow.init().openWindow('window-1', 'Javascript Community');
    });
  };
  return {
    link: link
  };
});
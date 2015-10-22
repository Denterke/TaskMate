/*!
 * =====================================================
 * Ratchet v2.0.2 (http://goratchet.com)
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 *
 * v2.0.2 designed by @connors.
 * =====================================================
 */
/* ========================================================================
 * Ratchet: modals.js v2.0.2
 * http://goratchet.com/components#modals
 * ========================================================================
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */
document.addEventListener("deviceready", function () {
	cordova.plugins.notification.local.hasPermission(function (granted) {
		if (!granted)
			cordova.plugins.notification.local.registerPermission(function (granted) {
			});
	});
	
	intel.xdk.device.hideSplashScreen();
});

document.addEventListener("click", function (data) {
	if (data.target.attributes[1].nodeValue.substr(0, 3) == "tdl")
		DoTask(data.target.attributes[1].nodeValue);
});


var currentTaskNumber;
var currentTaskListSelector = localStorage.getItem('currentTaskListSelector');

//capitalizes the first character
function ucFirst(str) {
 return str[0].toUpperCase() + str.slice(1);
}

//change the selection section
function changeSection() {
	var selector = localStorage.getItem('currentTaskListSelector');
	var node = document.getElementById(selector);

	if (document.getElementById('all').classList == "tab-item active") {
		document.getElementById('all').classList.remove("active");
		document.getElementById('all').classList.add("tab-item");
	}
	else if (document.getElementById('notComplited').classList == "tab-item active") {
		document.getElementById('notComplited').classList.remove("active");
		document.getElementById('notComplited').classList.add("tab-item");
	}
	else if (document.getElementById('complited').classList == "tab-item active") {
		document.getElementById('complited').classList.remove("active");
		document.getElementById('complited').classList.add("tab-item");
	}

	node.classList.add("active");
	
	switch (selector) {
		case 'all':
			document.getElementById("title").innerHTML = "Всё";
			break;
		case 'notComplited':
			document.getElementById("title").innerHTML = "Невыполненное";
			break;
		case 'complited':
			document.getElementById("title").innerHTML = "Выполненное";
			break;
	}
};

//list of all tasks
function TaskList(selector) {	
	if (!localStorage.getItem('currentTaskListSelector'))
		selector = "all";
	
	var tasksCount = parseInt(localStorage.getItem('TasksCount'));
	var tdMask = 'tdl_';
	var numberOfTask;
	
	document.getElementById("result").innerHTML = "";
	document.getElementById("importantResult").innerHTML = "";
	
	if (tasksCount > 0) {
		for (var i = 1; i <= tasksCount; i++) {
			numberOfTask = tdMask+i;
			if (localStorage.getItem(numberOfTask)) {
				
				task = ucFirst(JSON.parse(localStorage.getItem(numberOfTask))[0]);
				var taskDegree = JSON.parse(localStorage.getItem(numberOfTask))[2];
				var doTask = "";
				var taskIcon = "";
				
				if (JSON.parse(localStorage.getItem(numberOfTask))[2] == 0)
					taskIcon = '<span class="media-object pull-left icon icon-not-imp" style="margin-bottom: 0px!important;"></span>';
				else taskIcon = '<span class="media-object pull-left icon icon-imp" style="margin-bottom: 0px!important;"></span>';
				
				if (JSON.parse(localStorage.getItem(numberOfTask))[3] == false)
					doTask = '<div class="toggle" id="'+numberOfTask+'"><div class="toggle-handle" id="'+numberOfTask+'"></div></div>';
				else doTask = '<div class="toggle active" id="'+numberOfTask+'"><div class="toggle-handle" id="'+numberOfTask+'"></div></div>';
					
				var importantBeforeHtml = document.getElementById("importantResult").innerHTML;
				var beforeHtml = document.getElementById("result").innerHTML;

				var newTaskLi = '<li class="table-view-cell media">'+
					'<a href="taskDescription.html" onclick="localStorage.setItem(\'CurrentTask\', '+i+');" data-ignore="push">'+taskIcon+'<div class="layer task-name">'+task+'</div>'+'</a>'+
					doTask + 
					'</li>';
				
				switch (selector) {
					case 'all':
						localStorage.setItem('currentTaskListSelector', selector);
						if (taskDegree == 0)
							document.getElementById("result").innerHTML = newTaskLi + beforeHtml;
						if (taskDegree == 1)
							document.getElementById("importantResult").innerHTML = newTaskLi + importantBeforeHtml;
						break;
						
					case 'notComplited':
						localStorage.setItem('currentTaskListSelector', selector);
						if (JSON.parse(localStorage.getItem(numberOfTask))[3] == false) {
							if (taskDegree == 0)
								document.getElementById("result").innerHTML = newTaskLi + beforeHtml;
							if (taskDegree == 1)
								document.getElementById("importantResult").innerHTML = newTaskLi + importantBeforeHtml;
						}
						break;
						
						case 'complited':
						localStorage.setItem('currentTaskListSelector', selector);
						if (JSON.parse(localStorage.getItem(numberOfTask))[3] == true) {
							if (taskDegree == 0)
								document.getElementById("result").innerHTML = newTaskLi + beforeHtml;
							if (taskDegree == 1)
								document.getElementById("importantResult").innerHTML = newTaskLi + importantBeforeHtml;
						}
						break;	
				}
				
			}
		}
		
		changeSection();
		
	}
	else document.getElementById("title").innerHTML = "Задач нет :)";
};

//show desciption of task
function ShowDescription() {
	currentTaskNumber = 'tdl_' + localStorage.getItem('CurrentTask');
	var task = ucFirst(JSON.parse(localStorage.getItem(currentTaskNumber))[0]);
	var description = JSON.parse(localStorage.getItem(currentTaskNumber))[1];
	
	//if (task.length > 13)
		//task = task.substr(0, 13) + "...";
	
	htmlTask = document.getElementById("titleTask").innerHTML;
	htmlDescription = document.getElementById("description").innerHTML;
	
	document.getElementById("description").innerHTML = htmlDescription + description;
	document.getElementById("titleTask").innerHTML = htmlTask + task;	
	
	if (description == "") {
		$(".card").remove();
	}
};

function ShowEditTaskInformation() {
	currentTaskNumber = 'tdl_' + localStorage.getItem('CurrentTask');
	var editTaskInfo = document.getElementById("editForm").innerHTML;
	var task = JSON.parse(localStorage.getItem(currentTaskNumber))[0];
	var taskField = '<input type="text" placeholder="Задача" name="task" maxlength="30" value="'+task+'">';
	var description = JSON.parse(localStorage.getItem(currentTaskNumber))[1];
	var descriptionField = '<textarea rows="5" placeholder="Описание" name="description">'+description+'</textarea>';
	var degreeTask = JSON.parse(localStorage.getItem(currentTaskNumber))[2];
	var notification = JSON.parse(localStorage.getItem(currentTaskNumber))[4];
	var notificationField = '<input class="form-control" type="text" id="datetimepicker" value="'+notification+'" name="time" placeholder="Напоминание не установлено" readonly/>'
	
	var degreeTaskField = "";
	
	if (degreeTask == 0) 
		degreeTaskField = 
					'<div class="card">' +
						'<p>Важное <a class="icon pull-right icon-not-imp" style="line-height: inherit; font-size: 35px" onclick="MakeImportantTask();" id="important"></a></p>' +
					'</div>';
	if (degreeTask == 1)
		degreeTaskField = 
					'<div class="card">' +
						'<p>Важное <a class="icon pull-right icon-imp" style="line-height: inherit; font-size: 35px" onclick="MakeImportantTask();" id="important"></a></p>' +
					'</div>';
	
	document.getElementById("editForm").innerHTML = notificationField + taskField + descriptionField + degreeTaskField + editTaskInfo;
};

//clear list of all tasks
function queryDeleteAllTask() {
	navigator.notification.confirm(
    'Вы действительно хотите удалить все задачи из этого списка?', // message
     deleteAllTask,            // callback to invoke with index of button pressed
    'Удаление задач',           // title
    ['Да','Нет']     // buttonLabels
	);	
}
function deleteAllTask(buttonIndex) {
	var currentTaskListSelector = localStorage.getItem('currentTaskListSelector');
	var tasksCount = parseInt(localStorage.getItem('TasksCount'));
	var tdMask = 'tdl_';
	
	 if (buttonIndex == 1) {
		 switch (currentTaskListSelector) {
		case 'all':
			localStorage.clear();
			TaskList("all");
			break;

		case 'notComplited':
			if (tasksCount > 0) 
				for (var i = 1; i <= tasksCount; i++) {
					numberOfTask = tdMask+i;
					if (localStorage.getItem(numberOfTask)) 
						if (JSON.parse(localStorage.getItem(numberOfTask))[3] == false)
							localStorage.removeItem(numberOfTask);
				}
				TaskList("all");
				break;

		case 'complited':
			if (tasksCount > 0) 
				for (var i = 1; i <= tasksCount; i++) {
					numberOfTask = tdMask+i;
					if (localStorage.getItem(numberOfTask)) 
						if (JSON.parse(localStorage.getItem(numberOfTask))[3] == true)
							localStorage.removeItem(numberOfTask);
				}
			TaskList("all");
			break;	
		}
	 }
};

//delete Task
function queryDeleteTask() {
	navigator.notification.confirm(
    'Вы действительно хотите удалить задачу?', // message
     deleteTask,            // callback to invoke with index of button pressed
    'Удаление задачи',           // title
    ['Да','Нет']     // buttonLabels
	);
};
function deleteTask(buttonIndex) {
    if (buttonIndex == 1) {
			localStorage.removeItem(currentTaskNumber);
			location.href = "index.html";
		}
}

//add new task
function SubmitTask(form, selector) {
	
	if (!localStorage.getItem('TasksCount'))
		localStorage.setItem('TasksCount', 0);
	
	var tasksCount = localStorage.getItem('TasksCount');
	var tdMask = 'tdl_';
	var number;
	var task = form.task.value;
	var informationOfTask = [];
	var node = document.getElementById('important');
	var currentTime = new Date();
	var whenNotification = form.time.value;
	
	number = parseInt(tasksCount) + 1;
	if (task != "") {
		informationOfTask[0] = form.task.value;
		informationOfTask[1] = form.description.value;
		
		if (node.classList == "icon pull-right icon-not-imp") 
			informationOfTask[2] = 0; //важная - не важная задача
		else if (node.classList == "icon pull-right icon-imp") 
			informationOfTask[2] = 1; 
		
		informationOfTask[3] = false; //выполнена или нет
		
		//setTime and setNotification
		if (whenNotification != "") {
			var notification = new Date(whenNotification.split('.')[2].split(' ')[0], whenNotification.split('.')[1]-1, whenNotification.split('.')[0], whenNotification.split('.')[2].split(' ')[1].split(':')[0], whenNotification.split('.')[2].split(' ')[1].split(':')[1]);
			if (notification >= currentTime) {		
				informationOfTask[4] = form.time.value;
				
				cordova.plugins.notification.local.schedule({
					id: localStorage.getItem('TasksCount'),
					title: form.task.value,
					text: form.description.value,
					at: notification
				});				
			}
			else {
				navigator.notification.alert(
					"Похоже, что вы не успели выполнить вашу задачу! :C Установленное время уже прошло.", 
					null,
					"Напоминание не было установленно!", 
					"OK"
				);
				informationOfTask[4] = "";
			}
		}
		else informationOfTask[4] = "";
		
		if (selector == 'newTask') {
			localStorage.setItem(tdMask+number, JSON.stringify(informationOfTask));
			localStorage.setItem('TasksCount', parseInt(tasksCount)+1);
		}
		
		if (selector == 'editTask') {
			localStorage.setItem(tdMask+number, JSON.stringify(informationOfTask));
			localStorage.setItem('TasksCount', parseInt(tasksCount)+1);
			localStorage.removeItem(currentTaskNumber);
		}
		
	}
};

function MakeImportantTask() {
	var node = document.getElementById('important');
	if (node.classList == "icon pull-right icon-not-imp") {
		node.classList.remove("icon-not-imp");
		node.classList.add("icon-imp");
	}
	else if (node.classList == "icon pull-right icon-imp") {
		node.classList.remove("icon-imp");
		node.classList.add("icon-not-imp");
	}
};

function DoTask(number) {
	currentTask = number;
	var node = document.getElementById(currentTask);
	
	var informationOfTask = [];
	informationOfTask[0] = JSON.parse(localStorage.getItem(currentTask))[0];
	informationOfTask[1] = JSON.parse(localStorage.getItem(currentTask))[1];
	informationOfTask[2] = JSON.parse(localStorage.getItem(currentTask))[2];
	
	if (node.classList == "toggle active")
		informationOfTask[3] = true;
	if (node.classList == "toggle")
		informationOfTask[3] = false;
	
	localStorage.setItem(currentTask, JSON.stringify(informationOfTask));
}


!(function () {
  'use strict';

  var findModals = function (target) {
    var i;
    var modals = document.querySelectorAll('a');

    for (; target && target !== document; target = target.parentNode) {
      for (i = modals.length; i--;) {
        if (modals[i] === target) {
          return target;
        }
      }
    }
  };

  var getModal = function (event) {
    var modalToggle = findModals(event.target);
    if (modalToggle && modalToggle.hash) {
      return document.querySelector(modalToggle.hash);
    }
  };

  window.addEventListener('touchend', function (event) {
    var modal = getModal(event);
    if (modal) {
      if (modal && modal.classList.contains('modal')) {
        modal.classList.toggle('active');
      }
      event.preventDefault(); // prevents rewriting url (apps can still use hash values in url)
    }
  });
}());

/* ========================================================================
 * Ratchet: popovers.js v2.0.2
 * http://goratchet.com/components#popovers
 * ========================================================================
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */

!(function () {
  'use strict';

  var popover;

  var findPopovers = function (target) {
    var i;
    var popovers = document.querySelectorAll('a');

    for (; target && target !== document; target = target.parentNode) {
      for (i = popovers.length; i--;) {
        if (popovers[i] === target) {
          return target;
        }
      }
    }
  };

  var onPopoverHidden = function () {
    popover.style.display = 'none';
    popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
  };

  var backdrop = (function () {
    var element = document.createElement('div');

    element.classList.add('backdrop');

    element.addEventListener('touchend', function () {
      popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
      popover.classList.remove('visible');
      popover.parentNode.removeChild(backdrop);
    });

    return element;
  }());

  var getPopover = function (e) {
    var anchor = findPopovers(e.target);

    if (!anchor || !anchor.hash || (anchor.hash.indexOf('/') > 0)) {
      return;
    }

    try {
      popover = document.querySelector(anchor.hash);
    }
    catch (error) {
      popover = null;
    }

    if (popover === null) {
      return;
    }

    if (!popover || !popover.classList.contains('popover')) {
      return;
    }

    return popover;
  };

  var showHidePopover = function (e) {
    var popover = getPopover(e);

    if (!popover) {
      return;
    }

    popover.style.display = 'block';
    popover.offsetHeight;
    popover.classList.add('visible');

    popover.parentNode.appendChild(backdrop);
  };

  window.addEventListener('touchend', showHidePopover);

}());

/* ========================================================================
 * Ratchet: push.js v2.0.2
 * http://goratchet.com/components#push
 * ========================================================================
 * inspired by @defunkt's jquery.pjax.js
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */

/* global _gaq: true */

!(function () {
  'use strict';

  var noop = function () {};


  // Pushstate caching
  // ==================

  var isScrolling;
  var maxCacheLength = 20;
  var cacheMapping   = sessionStorage;
  var domCache       = {};
  var transitionMap  = {
    slideIn  : 'slide-out',
    slideOut : 'slide-in',
    fade     : 'fade'
  };

  var bars = {
    bartab             : '.bar-tab',
    barnav             : '.bar-nav',
    barfooter          : '.bar-footer',
    barheadersecondary : '.bar-header-secondary'
  };

  var cacheReplace = function (data, updates) {
    PUSH.id = data.id;
    if (updates) {
      data = getCached(data.id);
    }
    cacheMapping[data.id] = JSON.stringify(data);
    window.history.replaceState(data.id, data.title, data.url);
    domCache[data.id] = document.body.cloneNode(true);
  };

  var cachePush = function () {
    var id = PUSH.id;

    var cacheForwardStack = JSON.parse(cacheMapping.cacheForwardStack || '[]');
    var cacheBackStack    = JSON.parse(cacheMapping.cacheBackStack    || '[]');

    cacheBackStack.push(id);

    while (cacheForwardStack.length) {
      delete cacheMapping[cacheForwardStack.shift()];
    }
    while (cacheBackStack.length > maxCacheLength) {
      delete cacheMapping[cacheBackStack.shift()];
    }

    window.history.pushState(null, '', cacheMapping[PUSH.id].url);

    cacheMapping.cacheForwardStack = JSON.stringify(cacheForwardStack);
    cacheMapping.cacheBackStack    = JSON.stringify(cacheBackStack);
  };

  var cachePop = function (id, direction) {
    var forward           = direction === 'forward';
    var cacheForwardStack = JSON.parse(cacheMapping.cacheForwardStack || '[]');
    var cacheBackStack    = JSON.parse(cacheMapping.cacheBackStack    || '[]');
    var pushStack         = forward ? cacheBackStack    : cacheForwardStack;
    var popStack          = forward ? cacheForwardStack : cacheBackStack;

    if (PUSH.id) {
      pushStack.push(PUSH.id);
    }
    popStack.pop();

    cacheMapping.cacheForwardStack = JSON.stringify(cacheForwardStack);
    cacheMapping.cacheBackStack    = JSON.stringify(cacheBackStack);
  };

  var getCached = function (id) {
    return JSON.parse(cacheMapping[id] || null) || {};
  };

  var getTarget = function (e) {
    var target = findTarget(e.target);

    if (!target ||
        e.which > 1 ||
        e.metaKey ||
        e.ctrlKey ||
        isScrolling ||
        location.protocol !== target.protocol ||
        location.host     !== target.host ||
        !target.hash && /#/.test(target.href) ||
        target.hash && target.href.replace(target.hash, '') === location.href.replace(location.hash, '') ||
        target.getAttribute('data-ignore') === 'push') { return; }

    return target;
  };


  // Main event handlers (touchend, popstate)
  // ==========================================

  var touchend = function (e) {
    var target = getTarget(e);

    if (!target) {
      return;
    }

    e.preventDefault();

    PUSH({
      url        : target.href,
      hash       : target.hash,
      timeout    : target.getAttribute('data-timeout'),
      transition : target.getAttribute('data-transition')
    });
  };

  var popstate = function (e) {
    var key;
    var barElement;
    var activeObj;
    var activeDom;
    var direction;
    var transition;
    var transitionFrom;
    var transitionFromObj;
    var id = e.state;

    if (!id || !cacheMapping[id]) {
      return;
    }

    direction = PUSH.id < id ? 'forward' : 'back';

    cachePop(id, direction);

    activeObj = getCached(id);
    activeDom = domCache[id];

    if (activeObj.title) {
      document.title = activeObj.title;
    }

    if (direction === 'back') {
      transitionFrom    = JSON.parse(direction === 'back' ? cacheMapping.cacheForwardStack : cacheMapping.cacheBackStack);
      transitionFromObj = getCached(transitionFrom[transitionFrom.length - 1]);
    } else {
      transitionFromObj = activeObj;
    }

    if (direction === 'back' && !transitionFromObj.id) {
      return (PUSH.id = id);
    }

    transition = direction === 'back' ? transitionMap[transitionFromObj.transition] : transitionFromObj.transition;

    if (!activeDom) {
      return PUSH({
        id         : activeObj.id,
        url        : activeObj.url,
        title      : activeObj.title,
        timeout    : activeObj.timeout,
        transition : transition,
        ignorePush : true
      });
    }

    if (transitionFromObj.transition) {
      activeObj = extendWithDom(activeObj, '.content', activeDom.cloneNode(true));
      for (key in bars) {
        if (bars.hasOwnProperty(key)) {
          barElement = document.querySelector(bars[key]);
          if (activeObj[key]) {
            swapContent(activeObj[key], barElement);
          } else if (barElement) {
            barElement.parentNode.removeChild(barElement);
          }
        }
      }
    }

    swapContent(
      (activeObj.contents || activeDom).cloneNode(true),
      document.querySelector('.content'),
      transition
    );

    PUSH.id = id;

    document.body.offsetHeight; // force reflow to prevent scroll
  };


  // Core PUSH functionality
  // =======================

  var PUSH = function (options) {
    var key;
    var xhr = PUSH.xhr;

    options.container = options.container || options.transition ? document.querySelector('.content') : document.body;

    for (key in bars) {
      if (bars.hasOwnProperty(key)) {
        options[key] = options[key] || document.querySelector(bars[key]);
      }
    }

    if (xhr && xhr.readyState < 4) {
      xhr.onreadystatechange = noop;
      xhr.abort();
    }

    xhr = new XMLHttpRequest();
    xhr.open('GET', options.url, true);
    xhr.setRequestHeader('X-PUSH', 'true');

    xhr.onreadystatechange = function () {
      if (options._timeout) {
        clearTimeout(options._timeout);
      }
      if (xhr.readyState === 4) {
        xhr.status === 200 ? success(xhr, options) : failure(options.url);
      }
    };

    if (!PUSH.id) {
      cacheReplace({
        id         : +new Date(),
        url        : window.location.href,
        title      : document.title,
        timeout    : options.timeout,
        transition : null
      });
    }

    if (options.timeout) {
      options._timeout = setTimeout(function () {  xhr.abort('timeout'); }, options.timeout);
    }

    xhr.send();

    if (xhr.readyState && !options.ignorePush) {
      cachePush();
    }
  };


  // Main XHR handlers
  // =================

  var success = function (xhr, options) {
    var key;
    var barElement;
    var data = parseXHR(xhr, options);

    if (!data.contents) {
      return locationReplace(options.url);
    }

    if (data.title) {
      document.title = data.title;
    }

    if (options.transition) {
      for (key in bars) {
        if (bars.hasOwnProperty(key)) {
          barElement = document.querySelector(bars[key]);
          if (data[key]) {
            swapContent(data[key], barElement);
          } else if (barElement) {
            barElement.parentNode.removeChild(barElement);
          }
        }
      }
    }

    swapContent(data.contents, options.container, options.transition, function () {
      cacheReplace({
        id         : options.id || +new Date(),
        url        : data.url,
        title      : data.title,
        timeout    : options.timeout,
        transition : options.transition
      }, options.id);
      triggerStateChange();
    });

    if (!options.ignorePush && window._gaq) {
      _gaq.push(['_trackPageview']); // google analytics
    }
    if (!options.hash) {
      return;
    }
  };

  var failure = function (url) {
    throw new Error('Could not get: ' + url);
  };


  // PUSH helpers
  // ============

  var swapContent = function (swap, container, transition, complete) {
    var enter;
    var containerDirection;
    var swapDirection;

    if (!transition) {
      if (container) {
        container.innerHTML = swap.innerHTML;
      } else if (swap.classList.contains('content')) {
        document.body.appendChild(swap);
      } else {
        document.body.insertBefore(swap, document.querySelector('.content'));
      }
    } else {
      enter  = /in$/.test(transition);

      if (transition === 'fade') {
        container.classList.add('in');
        container.classList.add('fade');
        swap.classList.add('fade');
      }

      if (/slide/.test(transition)) {
        swap.classList.add('sliding-in', enter ? 'right' : 'left');
        swap.classList.add('sliding');
        container.classList.add('sliding');
      }

      container.parentNode.insertBefore(swap, container);
    }

    if (!transition) {
      complete && complete();
    }

    if (transition === 'fade') {
      container.offsetWidth; // force reflow
      container.classList.remove('in');
      var fadeContainerEnd = function () {
        container.removeEventListener('webkitTransitionEnd', fadeContainerEnd);
        swap.classList.add('in');
        swap.addEventListener('webkitTransitionEnd', fadeSwapEnd);
      };
      var fadeSwapEnd = function () {
        swap.removeEventListener('webkitTransitionEnd', fadeSwapEnd);
        container.parentNode.removeChild(container);
        swap.classList.remove('fade');
        swap.classList.remove('in');
        complete && complete();
      };
      container.addEventListener('webkitTransitionEnd', fadeContainerEnd);

    }

    if (/slide/.test(transition)) {
      var slideEnd = function () {
        swap.removeEventListener('webkitTransitionEnd', slideEnd);
        swap.classList.remove('sliding', 'sliding-in');
        swap.classList.remove(swapDirection);
        container.parentNode.removeChild(container);
        complete && complete();
      };

      container.offsetWidth; // force reflow
      swapDirection      = enter ? 'right' : 'left';
      containerDirection = enter ? 'left' : 'right';
      container.classList.add(containerDirection);
      swap.classList.remove(swapDirection);
      swap.addEventListener('webkitTransitionEnd', slideEnd);
    }
  };

  var triggerStateChange = function () {
    var e = new CustomEvent('push', {
      detail: { state: getCached(PUSH.id) },
      bubbles: true,
      cancelable: true
    });

    window.dispatchEvent(e);
  };

  var findTarget = function (target) {
    var i;
    var toggles = document.querySelectorAll('a');

    for (; target && target !== document; target = target.parentNode) {
      for (i = toggles.length; i--;) {
        if (toggles[i] === target) {
          return target;
        }
      }
    }
  };

  var locationReplace = function (url) {
    window.history.replaceState(null, '', '#');
    window.location.replace(url);
  };

  var extendWithDom = function (obj, fragment, dom) {
    var i;
    var result = {};

    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        result[i] = obj[i];
      }
    }

    Object.keys(bars).forEach(function (key) {
      var el = dom.querySelector(bars[key]);
      if (el) {
        el.parentNode.removeChild(el);
      }
      result[key] = el;
    });

    result.contents = dom.querySelector(fragment);

    return result;
  };

  var parseXHR = function (xhr, options) {
    var head;
    var body;
    var data = {};
    var responseText = xhr.responseText;

    data.url = options.url;

    if (!responseText) {
      return data;
    }

    if (/<html/i.test(responseText)) {
      head           = document.createElement('div');
      body           = document.createElement('div');
      head.innerHTML = responseText.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
      body.innerHTML = responseText.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0];
    } else {
      head           = body = document.createElement('div');
      head.innerHTML = responseText;
    }

    data.title = head.querySelector('title');
    var text = 'innerText' in data.title ? 'innerText' : 'textContent';
    data.title = data.title && data.title[text].trim();

    if (options.transition) {
      data = extendWithDom(data, '.content', body);
    } else {
      data.contents = body;
    }

    return data;
  };


  // Attach PUSH event handlers
  // ==========================

  window.addEventListener('touchstart', function () { isScrolling = false; });
  window.addEventListener('touchmove', function () { isScrolling = true; });
  window.addEventListener('touchend', touchend);
  window.addEventListener('click', function (e) { if (getTarget(e)) {e.preventDefault();} });
  window.addEventListener('popstate', popstate);
  window.PUSH = PUSH;

}());

/* ========================================================================
 * Ratchet: segmented-controllers.js v2.0.2
 * http://goratchet.com/components#segmentedControls
 * ========================================================================
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */

!(function () {
  'use strict';

  var getTarget = function (target) {
    var i;
    var segmentedControls = document.querySelectorAll('.segmented-control .control-item');

    for (; target && target !== document; target = target.parentNode) {
      for (i = segmentedControls.length; i--;) {
        if (segmentedControls[i] === target) {
          return target;
        }
      }
    }
  };

  window.addEventListener('touchend', function (e) {
    var activeTab;
    var activeBodies;
    var targetBody;
    var targetTab     = getTarget(e.target);
    var className     = 'active';
    var classSelector = '.' + className;

    if (!targetTab) {
      return;
    }

    activeTab = targetTab.parentNode.querySelector(classSelector);

    if (activeTab) {
      activeTab.classList.remove(className);
    }

    targetTab.classList.add(className);

    if (!targetTab.hash) {
      return;
    }

    targetBody = document.querySelector(targetTab.hash);

    if (!targetBody) {
      return;
    }

    activeBodies = targetBody.parentNode.querySelectorAll(classSelector);

    for (var i = 0; i < activeBodies.length; i++) {
      activeBodies[i].classList.remove(className);
    }

    targetBody.classList.add(className);
  });

  window.addEventListener('click', function (e) { if (getTarget(e.target)) {e.preventDefault();} });
}());

/* ========================================================================
 * Ratchet: sliders.js v2.0.2
 * http://goratchet.com/components#sliders
 * ========================================================================
   Adapted from Brad Birdsall's swipe
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */

!(function () {
  'use strict';

  var pageX;
  var pageY;
  var slider;
  var deltaX;
  var deltaY;
  var offsetX;
  var lastSlide;
  var startTime;
  var resistance;
  var sliderWidth;
  var slideNumber;
  var isScrolling;
  var scrollableArea;

  var getSlider = function (target) {
    var i;
    var sliders = document.querySelectorAll('.slider > .slide-group');

    for (; target && target !== document; target = target.parentNode) {
      for (i = sliders.length; i--;) {
        if (sliders[i] === target) {
          return target;
        }
      }
    }
  };

  var getScroll = function () {
    if ('webkitTransform' in slider.style) {
      var translate3d = slider.style.webkitTransform.match(/translate3d\(([^,]*)/);
      var ret = translate3d ? translate3d[1] : 0;
      return parseInt(ret, 10);
    }
  };

  var setSlideNumber = function (offset) {
    var round = offset ? (deltaX < 0 ? 'ceil' : 'floor') : 'round';
    slideNumber = Math[round](getScroll() / (scrollableArea / slider.children.length));
    slideNumber += offset;
    slideNumber = Math.min(slideNumber, 0);
    slideNumber = Math.max(-(slider.children.length - 1), slideNumber);
  };

  var onTouchStart = function (e) {
    slider = getSlider(e.target);

    if (!slider) {
      return;
    }

    var firstItem  = slider.querySelector('.slide');

    scrollableArea = firstItem.offsetWidth * slider.children.length;
    isScrolling    = undefined;
    sliderWidth    = slider.offsetWidth;
    resistance     = 1;
    lastSlide      = -(slider.children.length - 1);
    startTime      = +new Date();
    pageX          = e.touches[0].pageX;
    pageY          = e.touches[0].pageY;
    deltaX         = 0;
    deltaY         = 0;

    setSlideNumber(0);

    slider.style['-webkit-transition-duration'] = 0;
  };

  var onTouchMove = function (e) {
    if (e.touches.length > 1 || !slider) {
      return; // Exit if a pinch || no slider
    }

    deltaX = e.touches[0].pageX - pageX;
    deltaY = e.touches[0].pageY - pageY;
    pageX  = e.touches[0].pageX;
    pageY  = e.touches[0].pageY;

    if (typeof isScrolling === 'undefined') {
      isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
    }

    if (isScrolling) {
      return;
    }

    offsetX = (deltaX / resistance) + getScroll();

    e.preventDefault();

    resistance = slideNumber === 0         && deltaX > 0 ? (pageX / sliderWidth) + 1.25 :
                 slideNumber === lastSlide && deltaX < 0 ? (Math.abs(pageX) / sliderWidth) + 1.25 : 1;

    slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };

  var onTouchEnd = function (e) {
    if (!slider || isScrolling) {
      return;
    }

    setSlideNumber(
      (+new Date()) - startTime < 1000 && Math.abs(deltaX) > 15 ? (deltaX < 0 ? -1 : 1) : 0
    );

    offsetX = slideNumber * sliderWidth;

    slider.style['-webkit-transition-duration'] = '.2s';
    slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';

    e = new CustomEvent('slide', {
      detail: { slideNumber: Math.abs(slideNumber) },
      bubbles: true,
      cancelable: true
    });

    slider.parentNode.dispatchEvent(e);
  };

  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchmove', onTouchMove);
  window.addEventListener('touchend', onTouchEnd);

}());

/* ========================================================================
 * Ratchet: toggles.js v2.0.2
 * http://goratchet.com/components#toggles
 * ========================================================================
   Adapted from Brad Birdsall's swipe
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */

!(function () {
  'use strict';

  var start     = {};
  var touchMove = false;
  var distanceX = false;
  var toggle    = false;

  var findToggle = function (target) {
    var i;
    var toggles = document.querySelectorAll('.toggle');

    for (; target && target !== document; target = target.parentNode) {
      for (i = toggles.length; i--;) {
        if (toggles[i] === target) {
          return target;
        }
      }
    }
  };

  window.addEventListener('touchstart', function (e) {
    e = e.originalEvent || e;

    toggle = findToggle(e.target);

    if (!toggle) {
      return;
    }

    var handle      = toggle.querySelector('.toggle-handle');
    var toggleWidth = toggle.clientWidth;
    var handleWidth = handle.clientWidth;
    var offset      = toggle.classList.contains('active') ? (toggleWidth - handleWidth) : 0;

    start     = { pageX : e.touches[0].pageX - offset, pageY : e.touches[0].pageY };
    touchMove = false;
  });

  window.addEventListener('touchmove', function (e) {
    e = e.originalEvent || e;

    if (e.touches.length > 1) {
      return; // Exit if a pinch
    }

    if (!toggle) {
      return;
    }

    var handle      = toggle.querySelector('.toggle-handle');
    var current     = e.touches[0];
    var toggleWidth = toggle.clientWidth;
    var handleWidth = handle.clientWidth;
    var offset      = toggleWidth - handleWidth;

    touchMove = true;
    distanceX = current.pageX - start.pageX;

    if (Math.abs(distanceX) < Math.abs(current.pageY - start.pageY)) {
      return;
    }

    e.preventDefault();

    if (distanceX < 0) {
      return (handle.style.webkitTransform = 'translate3d(0,0,0)');
    }
    if (distanceX > offset) {
      return (handle.style.webkitTransform = 'translate3d(' + offset + 'px,0,0)');
    }

    handle.style.webkitTransform = 'translate3d(' + distanceX + 'px,0,0)';

    toggle.classList[(distanceX > (toggleWidth / 2 - handleWidth / 2)) ? 'add' : 'remove']('active');
  });

  window.addEventListener('touchend', function (e) {
    if (!toggle) {
      return;
    }

    var handle      = toggle.querySelector('.toggle-handle');
    var toggleWidth = toggle.clientWidth;
    var handleWidth = handle.clientWidth;
    var offset      = (toggleWidth - handleWidth);
    var slideOn     = (!touchMove && !toggle.classList.contains('active')) || (touchMove && (distanceX > (toggleWidth / 2 - handleWidth / 2)));

    if (slideOn) {
      handle.style.webkitTransform = 'translate3d(' + offset + 'px,0,0)';
    } else {
      handle.style.webkitTransform = 'translate3d(0,0,0)';
    }

    toggle.classList[slideOn ? 'add' : 'remove']('active');

    e = new CustomEvent('toggle', {
      detail: { isActive: slideOn },
      bubbles: true,
      cancelable: true
    });

    toggle.dispatchEvent(e);

    touchMove = false;
    toggle    = false;
  });

}());

(function () {

  var wdscript = 'https://cdn.wilddog.com/js/client/current/wilddog.js';
  var api = 'https://ismmu.wilddogio.com/';
  var haveUserName = false;
  var haveUserEmail = false;
  var haveContent = false;

  window.RLComments = {
    pageId: null,
    dataRef: null,
    container: document.body,
    comments: {},
    list: null,
    init: function (id, container) {
      var self = RLComments;
      this.pageId = id;
      if (container) {
        this.container = container;
      }
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.onload = function () {
        var path = api + 'comments/' + id;
        //console.log(path);
        self.dataRef = new Wilddog(path);
        self.dataRef.authAnonymously(function (e, d) {
          if (!e && d.token) {
            self.bind();
          }
        });
      };
      script.src = wdscript;
      document.head.appendChild(script);
    },
    bind: function () {
      var self = RLComments;
      self.setHtml();
      self.dataRef.on('child_added', function (ss2) {
        var cmt = ss2.val();
        var vDiv = document.createElement('div');
        vDiv.className = 'social-feed-box';
        vDiv.innerHTML = '<div class="social-avatar"><a href="" class="pull-left"><img alt="summer_blog" src="/images/head/summer_head.png"></a><div class="media-body"><a href="mailto:' + cmt.useremail + '">'+ cmt.username +'</a><small class="text-muted">' + (new Date(cmt.time)).toLocaleString() + '</small></div></div><div class="social-body"><p>' + cmt.content + ' </p></div></div>';
        self.list.appendChild(vDiv);
        /* 加载样式
        setTimeout(function () {
          vDiv.classList.add('shown');
        }, 160);
        */
      });
    },
    setHtml: function () {
      var self = RLComments;
      self.list = document.createElement('div');
      this.container.appendChild(self.list);
      var box = document.createElement('div');
      box.className = 'post-comments';

      box.innerHTML = '<div class="row"><div class="col-sm-6"><input placeholder="昵称（第一次提交后不可更改哦！）" type="text" id="postUserName" class="form-control"/></div>' +
          '<div class="col-sm-6"><input placeholder="邮箱（留个联系方式呗！）" type="email" id="postUserEmail" class="form-control"/></div></div>' +
          '<div class="row"><div class="col-lg-12"><textarea placeholder="评论..." id="postContent" class="form-control"></textarea></div>' +
          '<div class="col-sm-6"><button id="postSubmit" class="btn btn-primary">提交</button></div></div>';

      this.container.appendChild(box);

      var usernameInput = document.getElementById('postUserName'),
          emailInput = document.getElementById('postUserEmail'),
          contentInput = document.getElementById('postContent'),
          submitBtn = document.getElementById('postSubmit');

      if(localStorage.username) {
          usernameInput.value = localStorage.username;
          usernameInput.setAttribute('disabled','disabled');
      } else {
          usernameInput.addEventListener('blur', function () {
              var userName = usernameInput.value.trim();
              if(userName.trim() == ''){
                  usernameInput.className = 'input-error form-control';
                  usernameInput.placeholder = '请输入昵称！';
                  haveUserName = false;
              } else if(userName.length > 100){
                  usernameInput.className = 'input-error form-control';
                  usernameInput.placeholder = '用户名不能超过100个字符！';
                  haveUserName = false;
              } else {
                  usernameInput.className = 'form-control';
                  usernameInput.placeholder = '昵称（第一次提交后不可更改哦！）';
                  haveUserName = true;
              }
          });
      }
      if(localStorage.useremail) {
          emailInput.value = localStorage.useremail;
          emailInput.setAttribute('disabled','disabled');
      } else {
          emailInput.addEventListener('blur', function () {
          var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
          var userEmail = emailInput.value.trim();
          if(!reg.test(userEmail)){
              emailInput.className = 'input-error form-control';
              emailInput.placeholder = '请输入正确的邮箱！';
              haveUserEmail = false;
          } else {
              emailInput.className = 'form-control';
              emailInput.placeholder = '邮箱（留个联系方式呗！）';
              haveUserEmail = true;
          }
      });
      }
      
      contentInput.addEventListener('blur', function () {
          var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
          var userContent = contentInput.value.trim();
          if(userContent.trim() == ''){
              contentInput.className = 'input-error form-control';
              contentInput.placeholder = '评论...';
              haveContent = false;
          } else if (userContent.length > 1000){
              contentInput.className = 'input-error form-control';
              contentInput.placeholder = '太长啦，精简点呗！';
              haveContent = false;
          } else {
              contentInput.className = 'form-control';
              contentInput.placeholder = '评论...';
              haveContent = true;
          }
      });

      submitBtn.addEventListener('click', function () {
          if(!localStorage.username) {
              $('#postUserName').trigger("focus");
              if(haveUserName){
                  $('#postUserEmail').trigger("focus");
                  if(haveUserEmail){
                      $('#postContent').trigger("focus");
                  } else {
                      return false;
                  }
              } else{
                  return false;
              }
          } else {
              $('#postContent').trigger("focus");
          }

          if(!haveContent){return false;}

          self.dataRef.push({
            username: usernameInput.value.trim(),
            useremail: emailInput.value.trim(),
            content: contentInput.value.trim(),
            time: Date.now()
          });
          usernameInput.setAttribute('disabled','disabled');
          emailInput.setAttribute('disabled','disabled');
          localStorage.username = usernameInput.value.trim();
          localStorage.useremail = emailInput.value.trim();
          contentInput.value = '';
      });
    }
  };
})();
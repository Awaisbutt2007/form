;(function(){
  var _host='https://brain.hanzla.com';var _slug='untitled-form-2-5806c50c';
  var script=document.currentScript;
  var container=script?script.parentElement:document.body;
  fetch(_host+'/api/public/forms/'+_slug,{headers:{'Accept':'application/json'}})
    .then(function(r){if(!r.ok)throw new Error('Form not found');return r.json()})
    .then(function(res){renderForm(container,res.data)})
    .catch(function(e){container.innerHTML='<p style="color:red;font-size:14px">Form unavailable</p>';});
  var _submittedKey='llz-form-submitted:'+_slug;
  function renderForm(c,form){
    var theme=form.theme||{};
    var branding=form.branding||{};
    var primary=branding.primaryColor||theme.primaryColor||'#6366f1';
    var bg=branding.backgroundColor||theme.backgroundColor||'#ffffff';
    var text=branding.textColor||theme.textColor||'#1f2937';
    var radius=theme.borderRadius||'8px';
    var ff=theme.fontFamily||'inherit';
    var style='<style>.llz-form{font-family:'+ff+';background:'+bg+';color:'+text+';padding:24px;border-radius:'+radius+';border:1px solid #e5e7eb;max-width:500px;box-sizing:border-box}.llz-brand{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:.85em;font-weight:600}.llz-logo{max-width:120px;max-height:40px;object-fit:contain}.llz-powered{max-width:500px;margin-top:8px;text-align:center;font-family:'+ff+';font-size:12px;color:#9ca3af}.llz-form h2{margin:0 0 16px;font-size:1.2em}.llz-form p.desc{margin:0 0 16px;font-size:.9em;opacity:.8}.llz-field{margin-bottom:16px}.llz-label{display:block;margin-bottom:4px;font-size:.85em;font-weight:500}.llz-req{color:'+primary+'}.llz-input,.llz-select,.llz-textarea{width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:'+radius+';font-size:.95em;font-family:'+ff+';box-sizing:border-box;background:#fff;color:'+text+'}.llz-input:focus,.llz-select:focus,.llz-textarea:focus{outline:none;border-color:'+primary+'}.llz-textarea{min-height:80px;resize:vertical}.llz-check{display:flex;align-items:center;gap:8px;cursor:pointer}.llz-check input{width:16px;height:16px;accent-color:'+primary+'}.llz-btn{background:'+primary+';color:#fff;border:none;padding:10px 20px;border-radius:'+radius+';font-size:.95em;cursor:pointer;width:100%;font-family:'+ff+'}.llz-btn:hover{opacity:.9}.llz-btn:disabled{opacity:.6;cursor:not-allowed}.llz-err{color:#ef4444;font-size:.8em;margin-top:4px}.llz-success{text-align:center;padding:32px;font-size:1.1em;color:'+primary+'}</style>';
    // Already submitted in this session -> show the thank-you state instead of the form on reload.
    var _prevMsg=null;try{_prevMsg=sessionStorage.getItem(_submittedKey);}catch(e){}
    if(_prevMsg!==null){c.innerHTML=style+'<div class="llz-success">'+esc(_prevMsg||'Thank you!')+'</div>';return;}
    var html=style+'<form class="llz-form" id="llz-'+_slug+'">';
    if(branding.logoUrl||branding.brandName){
      html+='<div class="llz-brand">';
      if(branding.logoUrl)html+='<img class="llz-logo" src="'+esc(branding.logoUrl)+'" alt="'+esc(branding.brandName||form.name||'Form logo')+'">';
      if(branding.brandName)html+='<span>'+esc(branding.brandName)+'</span>';
      html+='</div>';
    }
    if(form.name)html+='<h2>'+esc(form.name)+'</h2>';
    if(form.description)html+='<p class="desc">'+esc(form.description)+'</p>';
    (form.fields||[]).forEach(function(f){
      if(f.type==='hidden'){html+='<input type="hidden" id="llz-f-'+f.id+'" name="'+f.id+'" value="">';return;}
      html+='<div class="llz-field">';
      if(f.type==='checkbox'){
        html+='<label class="llz-check"><input type="checkbox" id="llz-f-'+f.id+'" name="'+f.id+'">'+'<span>'+esc(f.label)+(f.required?' <span class="llz-req">*</span>':'')+'</span></label>';
      }else{
        html+='<label class="llz-label" for="llz-f-'+f.id+'">'+esc(f.label)+(f.required?' <span class="llz-req">*</span>':'')+'</label>';
        if(f.type==='select'){
          html+='<select class="llz-select" id="llz-f-'+f.id+'" name="'+f.id+'"'+(f.required?' required':'')+'><option value="">Select...</option>';
          (f.options||[]).forEach(function(o){html+='<option value="'+esc(o)+'">'+esc(o)+'</option>';});
          html+='</select>';
        }else if(f.type==='textarea'){
          html+='<textarea class="llz-textarea" id="llz-f-'+f.id+'" name="'+f.id+'" placeholder="'+esc(f.placeholder||'')+'"'+(f.required?' required':'')+'></textarea>';
        }else{
          var inputType=f.type==='email'?'email':f.type==='phone'?'tel':'text';
          html+='<input class="llz-input" type="'+inputType+'" id="llz-f-'+f.id+'" name="'+f.id+'" placeholder="'+esc(f.placeholder||'')+'"'+(f.required?' required':'')+'>';
        }
      }
      html+='<div class="llz-err" id="llz-e-'+f.id+'"></div></div>';
    });
    html+='<button type="submit" class="llz-btn">'+esc(form.submitButtonLabel||'Submit')+'</button><div class="llz-err" id="llz-global-'+_slug+'"></div>';
    html+='</form>';
    if(form.showPoweredBy!==false)html+='<div class="llz-powered">Powered by LeadLyze</div>';
    c.innerHTML=html;
    var formEl=c.querySelector('#llz-'+_slug);
    formEl.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=formEl.querySelector('button[type=submit]');
      btn.disabled=true;btn.textContent='Submitting...';
      var globalErr=document.getElementById('llz-global-'+_slug);
      if(globalErr)globalErr.textContent='';
      var payload={};
      (form.fields||[]).forEach(function(f){
        var el=document.getElementById('llz-f-'+f.id);
        if(!el)return;
        payload[f.id]=f.type==='checkbox'?el.checked:el.value;
        var errEl=document.getElementById('llz-e-'+f.id);
        if(errEl)errEl.textContent='';
      });
      // Required-field validation. Native 'required' covers text/email/select/textarea but
      // not checkbox (no native attr), so enforce every required field here and show inline errors.
      var hasError=false;
      (form.fields||[]).forEach(function(f){
        if(f.type==='hidden'||!f.required)return;
        var val=payload[f.id];
        var missing=f.type==='checkbox'?val!==true:(val==null||String(val).trim()==='');
        if(missing){
          var errEl=document.getElementById('llz-e-'+f.id);
          if(errEl)errEl.textContent=esc(f.label)+' is required';
          hasError=true;
        }
      });
      if(hasError){btn.disabled=false;btn.textContent=esc(form.submitButtonLabel||'Submit');return;}
      fetch(_host+'/api/public/forms/'+_slug+'/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){return r.json().then(function(d){return{ok:r.ok,data:d};});})
        .then(function(r){
          if(r.ok){
            if(r.data.redirectUrl){window.location.href=r.data.redirectUrl;return;}
            var _msg=r.data.message||'Thank you!';
            try{sessionStorage.setItem(_submittedKey,_msg);}catch(e){}
            c.innerHTML=style+'<div class="llz-success">'+esc(_msg)+'</div>';
          }else{
            btn.disabled=false;btn.textContent=esc(form.submitButtonLabel||'Submit');
            var errs=r.data.errors||{};
            Object.keys(errs).forEach(function(fid){
              var el=document.getElementById('llz-e-'+fid);if(el)el.textContent=errs[fid];
            });
            if(r.data.error&&!Object.keys(errs).length&&globalErr)globalErr.textContent=r.data.error;
          }
        })
        .catch(function(){btn.disabled=false;btn.textContent=esc(form.submitButtonLabel||'Submit');if(globalErr)globalErr.textContent='Submission failed. Please try again.';});
    });
  }
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
})();
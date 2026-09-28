const o={enabled:!1};function i(){return o.enabled}async function n(e){return console.info("[email] Not configured — skipped:",e.subject,"→",e.to_email),!1}async function c(e){try{await n({to_email:e.email,to_name:e.name,subject:"Welcome to the Testing Platform! 🎉",message:`Dear ${e.name},

Your student account has been created successfully. You can now log in and start taking tests.

Good luck!`})}catch{}}async function m(e,t){try{for(const a of t)await n({to_email:a.email,to_name:a.name,subject:`New Test Assigned: ${e.title}`,message:`Dear ${a.name},

A new test "${e.title}" has been assigned to your class.

${e.description||""}

Log in to your dashboard to start it.`})}catch{}}async function l(e,t,a,s){try{await n({to_email:a.email,to_name:a.name,subject:`⚠️ Test Paused: ${e.name} (${s})`,message:`Student ${e.name} (${e.email}) was auto-paused during "${t.title}" (Test ID: ${s}).

They have been instructed to contact you to resume.`})}catch{}}async function u(e,t,a,s){try{await n({to_email:a.email,to_name:a.name,subject:`📝 Test Submitted: ${e.name} scored ${s}%`,message:`${e.name} (${e.email}) completed "${t.title}" with a score of ${s}%.`})}catch{}}export{i as isEmailConfigured,u as sendResultSubmittedAlert,m as sendTestAssignedEmails,l as sendTestPausedAlert,c as sendWelcomeEmail};

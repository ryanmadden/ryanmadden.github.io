---
layout: post
title: How To Deploy Meteor On Heroku
---

**2021 Update: This is from 2016, proceed with caution. The mlab free tier doesn't exist anymore.**

_This guide shows you how to quickly deploy a Meteor app to a free Heroku host with an mLab MongoDB. Enjoy!_

**Make a Heroku account.** Go to heroku.com and create an account for yourself or your team. This heroku account gives you a free hosting allotment per month even without a credit card. The downside is that if no one has accessed your app within the last half hour or so then the server takes about 20 seconds to start up.


**Create a new app on Heroku.** Login to heroku and go to the dashboard. Click on the ‘New’ button and pick a name for your app. It’s okay if this is different than the name of your git repo. We will use this name again in a moment. 


**Connect your repository to Heroku.** Open a terminal window and browse to your Meteor project directory. Run 
`heroku login` and enter your credentials. Run `heroku git:remote -a $NAME` where `$NAME` is the name of your project on heroku. You should see `git remote heroku added`. For more information, see heroku’s instructions on deployment. 


**Setup the buildpack.** Run `heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git` in your project directory to add the buildback to your project. A ‘buildpack’ is heroku terminology for all the configuration stuff that tells heroku how to setup your app. Luckily a nice person made a great one for us so we don’t need to do it ourselves. If you’d like to learn more about Meteor Buildpack Horse (including the significance of ‘Horse’) check out the README in the git repo [here](https://github.com/AdmitHub/meteor-buildpack-horse).


**Setup a MongoDB.** Your app will need a database. If you already have one set up then you can skip this step. If you don’t have a database but have added a credit card to your heroku account you can simply run `heroku addons:create mongolab` from your project directory and heroku will configure a MongoDB for you. This is the easiest option for setting up a database, otherwise you can do it manually.


To manually setup a database go to mLab.com and create an account for yourself or your team. Using the mLab dashboard, create a new database and go to the Users tab. Create a new database username and password. Near the top of the page there is a box containing a MongoDB URI that begins with “mongodb://”. This is the MONGO_URL that you will use in the next step.


**Link your MongoDB to your app.** If you created a database using the `heroku addons:create mongolab` command then you can skip this step. To tell heroku where our database is we must configure the MONGO_URL environment variable. To do this, run `heroku config:set MONGO_URL=”$URL”` where `$URL` is the MongoDB URI of your database. Note that it should be enclosed in quotes.


MongoDB URIs begin with “mongodb://”. If you set up your database manually in the last step then you can simply copy the URI on the mLab dashboard and replace <dbuser> and <dbpassword> with the username and password of the database user you created.


**Set the ROOT_URL.** Run `heroku config:set ROOT_URL="https://<appname>.herokuapp.com"` where `<appname>` is the name of your app on heroku. If you have a custom domain you can use that as the ROOT_URL instead. 


**Deploy.** Run `git push heroku master` to deploy to heroku. Your terminal will print some short logs that look a lot like what you see when you push to GitHub. After that you will begin to see lines prefaced by `remote:`. These are logs from Heroku documenting the setup process. You can watch them if you like or you can turn off your computer and go for a walk. The deploy takes about five minutes so it might have to be a short walk.

**Logs.** Run `heroku logs --tail` from your project directory to get real-time logs from your Heroku server. 

# Deploying

Only employees of Glitch will be able to do this step, and here it is! 

You should perform these steps immediately after clicking the "Merge pull request" button on your PR in Github. 

### Announce the Deployment

Be present in our `#community-deploy` chat room and say that you're starting a deploy and what you're deploying.

Keep a passive eye on the chat room while you work, in case anyone needs to talk to you about it while you've got it in flight.

### Merge in Live Changes

We need to make sure any live changes are merged and happy.  This is a Glitch site, after all-- we're not forcing the PR workflow, especially for small changes.

In your local git repository:

```
  # Make sure we're in the right place and up to date.
  git checkout master
  git pull

  # Pull in any live changes that aren't yet in Master:
  git pull live master
  
  # Merge if needed
  # [ This is on you. 🐉 ]
  
  # Then push these changes back up to github
  git push origin master
  
``` 

Or, run `./sh/merge.sh`.

Ok, now the GitHub repository is updated and stable. 

### Stage the Deployment

We're going to put our release candidate onto community-staging.glitch.me.

Go to [https://glitch.com/~community-staging](https://glitch.com/~community-staging) and open up the console.
  ```
  git log -1 # Prints out a stable changeset in case we need it.
  git pull # Update us to master.
  
  # That last step should never need to merge.
  # If it does, something went wrong or somebody edited community-staging directly.
  # Ask someone on the team in #community for help!
  
  refresh # Update the Glitch editor with the new files and kick off the build.
  ```

Now open up the logs and wait for the build to finish, then test your stuff.

_**protip**: while you wait for the build to complete, use this time to put together a little test plan for yourself.  What are the things you should double-check before your changes go live?_

In particular test anything that you merged with.  Make sure there's no console errors, etc.  If you find a problem, stop here and go back to the PR phase to fix it up.

Satisfied?  Deploy it.

Unsatisfied?  You'll want to revert the PR in GitHub
![picture of revert option in github](https://cdn.glitch.com/e7059ab5-55e6-49e7-9f97-0c93dc3ca016%2FScreen%20Shot%202019-08-28%20at%201.43.53%20PM.png?v=1567019148161)

Merge the revert in GitHub, and pull that update into `~community-staging`. Double check that you're back to a good state, and go fix the issues in your remix!


### Deploy

Run the _special command_ to swap `~community` with `~community-staging`.

(there's a special endpoint for this, ask us about it and sit beside a team member the first time you use it.   It's the same thing as renaming the two projects, but it does this atomically and without downtime, which you can't do if you rename them manually.)

#### If You Need to Revert the Deploy

Repeat the _special command_ to swap `~community` with `~community-staging`.

Thereby putting things back the way they were. Now you have time to fix it and try again. 

After you revert, check on if any live changes were made to the site after you deployed and before you reverted. (Are the curated items the same on both `~community` and `~community-staging`?).  If so, port the curated updates to the reverted page so that the edits are preserved.

### Verify the Deployment

Take a glance at glitch.com and see that your changes are live.
(There's a 5 minute cloudfront cache, so you can view community.glitch.me if you need to get around that, or otherwise go to an uncached glitch.com URL to bypass it.)

This is also a fun time to grab a screenshot and share what you've shipped, if you like.

Run `./sh/teardown.sh` on your local machine to remove the branch and remote for your remix from your local git repository.

### Announce Completion

Good job :-) Pop back over to `#community-deploy` and tell the room that you're all done.

### Deploy Checklist

Here's a short and sweet version of the steps above that you can use once you're comfortable with the deploy process:

1. Tell `#community-deploy` that you're about to merge + deploy
2. Run `.sh/merge.sh`
3. Go to [~community-staging](https://glitch.com/~community-staging) and open up the console
    - `git pull` to update to master
    - Double check that `git pull` doesn't require any merges
    - Run `refresh`
4. Open the `~community-staging` logs, wait for the build to finish (~7-9 minutes)
5. Test/QA your changes, check for console errors, etc.
6. Deploy it with the swap script!
7. Tell `#community-deploy` that you've finished the swap

--------------------

**Making Live Edits**

 _Can I just edit `~community` directly, since it’s Glitch we’re dealing with here?_
  
Sure thing. All standard caveats and cautions apply.  This is appropriate for updating the curated content, fixing typos, editing .md files, and one-line bug fixes. Our build scripts don't update the live site until the build is healthy and your changes are complete.
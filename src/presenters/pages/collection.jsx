import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import ProjectModel from '../../models/project';

import Loader, {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';

import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import CollectionEditor from '../collection-editor.jsx';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import AddCollectionProject from '../includes/add-collection-project.jsx';
import AddCollectionAvatar from '../includes/add-collection-avatar.jsx';

import EditCollectionColor from '../includes/edit-collection-color.jsx';

import {avatars} from '../../models/collection.js'; 

import {CurrentUserConsumer} from '../current-user.jsx';

const hexToRgbA = (hex) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.4)';
  }
  throw new Error('Bad Hex');
};


const CollectionPage = ({
  collection, 
  api, 
  color, 
  setColor, 
  avatar, 
  setAvatar, 
  isAuthorized, 
  updateName, 
  updateDescription, 
  projectOptions, 
  uploadAvatar, 
  addProject, 
  removeProject,
  ...props}) => (
  
    <React.Fragment>  
    <Helmet>
      <title>{(collection ? collection.name : name)}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: hexToRgbA(color)}}>
        <header className="collection">
          <h1 className="collection-name">
            {/* TO DO: actually update name */}
            {(isAuthorized 
              ? <AuthDescription authorized={isAuthorized}
                description={(collection ? collection.name : name)} 
                update={updateName => null} 
                placeholder="Name your collection"/> 
              : <React.Fragment>{collection.name} </React.Fragment>
            )}
          </h1>
          <div className="collection-image-container">
            <img src={avatar} alt=""/>
          </div>
          {/* TO DO: actually enable uploading avatar - see example of uploadAvatar in user-editor.jsx */}
          {isAuthorized 
            ? <div className="upload-image-buttons">
              
              <AddCollectionAvatar
                api={api}
                collectionID = {collection.id}
                setAvatar={setAvatar}
              />
              
              {/*
                <button className="button button-small button-tertiary" onClick={uploadAvatar}>
                  <span>Replace Avatar</span>  
                </button>
              */}
              
            </div>
            : null
          }
          
          <p className="description">
            {/* TO DO: actually update description */}
            <AuthDescription
              authorized={isAuthorized} description={collection.description}
              update={updateDescription} placeholder="Tell us about your collection"
            />
          </p>
          
          
          <EditCollectionColor
            api={api}
            collectionID={collection.id}
            currentUserIsOwner={true}
            setColor={setColor}
          />
          
          {(isAuthorized
            ? <button className={`button delete-collection button-tertiary`} >
              Delete Collection
            </button>
            : null
          )}
          
        </header>
        
        {collection
          ? <ProjectsLoader api={api} projects={collection.projects}>
            {projects => 
              <React.Fragment>
                <div className="collection-contents">
                  <div className="collection-project-container-header">
                    <h3>Projects ({collection.projects.length})</h3>
                
                    {(isAuthorized 
                      ? <AddCollectionProject
                        addProject={addProject}
                        api={api}
                        collectionProjects={collection.projects}
                        currentUserIsOwner={true}
                      />
                      : null
                    )}
                
                  </div>
          
                  <ProjectsUL projects={projects} categoryColor={color} 
                    projectOptions={{
                      removeProjectFromCollection: removeProject,
                      addProjectToCollection: {addProject}
                    }} 
                    {...props}/>
                </div>
          
              </React.Fragment>
            }
          </ProjectsLoader>
        
          : 
          <React.Fragment>
            <div className="collection-project-container-header">
              <h3>Projects</h3>
                
              {(isAuthorized 
                ? <AddCollectionProject
                  api={api}
                  collectionProjects={null}
                  currentUserIsOwner={true}
                  myProjects= {[]}
                />
                : null
              )}
              <div className="empty-collection-hint" style={{backgroundColor: color}}>
                Click <b>Add Project</b> to search for projects to add to your collection.<br/><br/>You can add any project, created by any user.
              </div>
                
            </div>
          
          </React.Fragment>
        }
        
      </article>
      
    </main>
    <Categories/>
  </React.Fragment>
);

CollectionPage.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  addProject: PropTypes.func,
  addProjectToCollection: PropTypes.func,
  api: PropTypes.any.isRequired,
  children: PropTypes.node,
  isAuthorized: PropTypes.any.isRequired,  
  projectOptions: PropTypes.object,
  removeProject: PropTypes.func,
  uploadAvatar: PropTypes.func,
};

const CollectionPageError = ({...props}) => (
  "Something went wrong. Try refreshing?"  
);

async function getUserIdByLogin(api, user){
  let {data} = await api.get(`userid/byLogin/${user}`);
  if(data === "NOT FOUND"){
    return null;
  }
  return data;
}

async function loadCollection(api, user, name){
  console.log('loadCollection');
  
  const userId = await getUserIdByLogin(api,user);
  
  let collectionMatch = null;
  const {data} = await api.get(`collections?userId=${userId}`);
  
  data.forEach(function loop(el, i){
    if(loop.stop){return;}
    if(el.url === name){
      collectionMatch = data[i];
      loop.stop = true;
    }
  });
  if(!collectionMatch){
    return null;
  }
  console.log("load collection complete with collectionMatch: %O", collectionMatch);
  return collectionMatch;
}
  

const CollectionPageLoader = ({api, user, name, addProject, removeProject, ...props}) => (
  <Layout api={api}>
    <DataLoader get={() => loadCollection(api, user, name)}
      renderLoader={() => <Loader/>}
      renderError={() => <CollectionPageError {...props}/>}
    >
      {collection => (
        <CollectionEditor api={api} initialCollection={collection}>
          {(collection, color, setColor, avatar, setAvatar, funcs, ...args) =>{
              <CollectionPage collection={collection} setColor={setColor} color={color} setAvatar={setAvatar} avatar={avatar} api={api} isAuthorized={true} addProject={addProject} removeProject={removeProject} {...props}/>
                }
          }
        </CollectionEditor>
      )}
    </DataLoader>
  </Layout>
);

CollectionPageLoader.propTypes = {
  api: PropTypes.any.isRequired,
  addProject: PropTypes.func,
  removeProject: PropTypes.func,
}

export default CollectionPageLoader;
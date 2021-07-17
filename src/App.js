import React, { useState, useEffect } from 'react'
import './App.css';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import { db, auth } from "./firebase";
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';




function getModalStyle() {

  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },


}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {

        setUser(authUser);
        if (authUser.displayName) {
        } else {
          return authUser.updateProfile({
            displayName: username
          })
        }

      } else {
        setUser(null);
      }

    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);


  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data(),
        })));
      })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="legend.jpg"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button class="btn2" type="submit" onClick={signUp}>Sign Up</Button>

          </form>

        </div>

      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >

        <div style={modalStyle} className={classes.paper}>

          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="legend.jpg"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button class="btn1" type="submit" onClick={signIn}>Sign In</Button>

          </form>

        </div>

      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="legend.jpg"
          alt=""
        />

        {user ? (
          <Button class="btn4" onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button class="btn5" onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button class="btn6" onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>




      <div className="avatargroup">
        <h3 className="stories">Stories</h3>
        <div className="hidden-avatars">
          +5
        </div>
        <div className="avatar">
          <img src="https://i.ytimg.com/vi/0yn1ICa3blk/maxresdefault.jpg" alt="kiko" />
          <div className="overlay__avatar">Kiko Matos</div>
        </div>
        <div className="avatar">
          <img src="https://sa.kapamilya.com/absnews/abscbnnews/media/2017/entertainment/09/10/091017-marlou.jpg" alt="marlou" />
          <div className="overlay__avatar">Marlou</div>
        </div>
        <div className="avatar">
          <img src="https://pbs.twimg.com/profile_images/1389779101477576707/EqoN3zDM_400x400.jpg" alt="rendon" />
          <div className="overlay__avatar">Rendon Labador</div>
        </div>
        <div className="avatar">
          <img src="https://tnt.abante.com.ph/wp-content/uploads/2020/01/makagago.jpg" alt="wazzup" />
          <div className="overlay__avatar">Mr. MG</div>
        </div>
        <div className="avatar">
          <img src="https://pbs.twimg.com/media/EVaGi5qU4AEIpuL.jpg" alt="jonah" />
          <div className="overlay__avatar">Brusko Jonah</div>
        </div>


      </div>
      <div className="app__post">

        {
          posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }




      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h2 className="message"> Sorry you need to login to upload!</h2>
      )}
    </div>




  );
}


export default App;

import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery,useMutation } from '@apollo/client';

import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations'

import Auth from '../utils/auth';
// import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {

  // useQuery
  const { loading, error, data: userData } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK)

  if ( loading ) {
    console.log('loading')
  }

  if (error) {
    console.log(`An error on loading: ${error}`)
  }

  if (userData) {
    console.log('data: ', userData.me.savedBooks)
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await removeBook({
        variables: {
          bookId: bookId
        },
        refetchQueries: [GET_ME]
      });

      console.log('remove book response: ', response)

      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // const updatedUser = await response.json();
      //setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      // removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData ? (userData.me.savedBooks.length ? `Viewing ${userData.me.savedBooks.length} saved ${userData.me.savedBooks.length === 1 ? 'book' : 'books'}` : "No Books") :"nothing" }
        </h2>
        <CardColumns>
          {userData ? userData.me.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>Title: {book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          }) : "Waiting for data"}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;

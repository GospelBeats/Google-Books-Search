import React, { Component } from "react";
import { toast } from "react-toastify";
import Book from "../components/Book/index";
import SearchForm from "../components/SearchForm/index";
import { List } from "../components/List/index";
import API from "../utils/API";

class Search extends Component {
  state = {
    books: [],
    q: "",
    message: "Search for books with Google Books API"
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  getBooks = () => {
    API.getBooks(this.state.q)
      .then(results => {
        console.log(results);
        let bookArray = results.data.items.map(
          result => {
            return {
              id: result.id,
              title: result.volumeInfo.title,
              infoLink: result.volumeInfo.infoLink,
              authors: result.volumeInfo.authors,
              description: result.volumeInfo.description,
              imageLinks: result.volumeInfo.imageLinks,
              thumbnail: result.volumeInfo.imageLinks.thumbnail
            }
          }
        );

        this.setState({
          books: bookArray,
          currentPage: 1
        })
      })
      .catch(() => {
        toast.error("Your search did not match any book results.");

        this.setState({
          books: [],
          message: "Your search did not match any book results.",
          currentPage: 1
        });
      });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    toast.info("Searching ... !");
    this.getBooks();
  };

  handleBookSave = id => {
    const book = this.state.books.find(book => book.id === id);
console.log(book);
    API.saveBook({
      googleId: book.id,
      title: book.title,
      link: book.infoLink,
      authors: book.authors,
      description: book.description,
      image: book.imageLinks.thumbnail
    }).then(() => this.getBooks());
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-10 col-centered">
            <div className="d-flex flex-wrap flex-row bd-highlight mb-3 justify-content-center align-items-center">
              <div className="order-sm-2 p-2 bd-highlight">
                <img
                  className="image-250"
                  src="/images/img-books-window.png"
                  alt="React Google Books Search"
                />
              </div>
              <div className="order-sm-1 p-2 bd-highlight">
                <h1 className="heading-title mx-sm-3 mb-2">
                  React Google Books Search
                </h1>
                
                <SearchForm
                  handleInputChange={this.handleInputChange}
                  handleFormSubmit={this.handleFormSubmit}
                  q={this.state.q}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-10 col-centered card-content mb-4">
            <h1 className="heading-title mx-sm-3 mb-2 text-center">Results</h1>

            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <Book
                    key={book.id}
                    title={book.title}
                    subtitle={book.subtitle}
                    link={book.infoLink}
                    authors={book.authors.join(", ")}
                    description={book.description}
                    image={book.imageLinks.thumbnail}
                    Button={() => (
                      <button
                        onClick={() => this.handleBookSave(book.id)}
                        className="btn save-button  heading-subtitle ml-2"
                      >
                        Save
                      </button>
                    )}
                  />
                ))}
              </List>
            ) : (
                <div className="mockup-content">
                  <h2 className="heading-title text-center">
                    {this.state.message}
                  </h2>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Search;

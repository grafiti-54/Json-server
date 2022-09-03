//npm run server (back)
//npm start ( front)
import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Form,
  FormLabel,
  Navbar,
} from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

//!DEV
//const api = "http://localhost:5000/users";

//?PROD
const api = "https://cg-json-server-react.herokuapp.com/users"

//valeur par défaut des champs du formulaire
const initialState = {
  name: "",
  email: "",
  contact: "",
  adress: "",
};

function App() {
  // valeur des champs du formulaire
  const [state, setState] = useState(initialState);

  //stockage et modification des données
  const [data, setData] = useState([]);

  const [userId, setUserId] = useState(null); // recuération pour la modification d'un contact
  const [editMode, setEditMode] = useState(false);

  const { name, email, contact, adress } = state;

  //lecture des données de la bdd au moment du chargement de la page
  useEffect(() => {
    loadUsers();
  }, []);

  //recupération des données de la bdd
  const loadUsers = async () => {
    const response = await axios.get(api);
    setData(response.data);
  };

  // récupération des données renseigné dans les champs du formulaire
  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  //fonction de suppression d'un contact
  const handleDelete = async (id) => {
    if (window.confirm("Etes-vous sur de vouloir supprimer ce contact ?")) {
      axios.delete(`${api}/${id}`);
      toast.success("Supprimer avec succes");
      setTimeout(() => loadUsers(), 500); //va rafraichir la page en 500milliseconde avec les nouvelles données
    }
  };

  //function de modification d'un contact
  const handleUpdate = (id) => {
    const singleUser = data.find((item) => item.id == id);
    setState({ ...singleUser }); // place dans les input du formulaire les données récupéré du contact
    setUserId(id);
    setEditMode(true);
  };

  //validation du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !adress || !email || !contact) {
      toast.error("Remplir tout les champs svp");
    } else {
      //ajout contact (formulaire d'ajout)
      if (!editMode) {
        axios.post(api, state);
        toast.success("Ajout avec succes");
        setState({ name: "", email: "", contact: "", adress: "" });
        setTimeout(() => loadUsers(), 500);
        // relance la fonction de recupération des données appelé dans le useEffect qui va rafraichir la page en 500milliseconde
      } else {
        //modification contact (formulaire modif contact)
        axios.put(`${api}/${userId}`, state);
        toast.success("Modification avec succes");
        setState({ name: "", email: "", contact: "", adress: "" });
        setTimeout(() => loadUsers(), 500);
        setUserId(null); // remise a zéro après validation
        setEditMode(false); // retourne sur le formulaire d'ajout de contact
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar bg="primary" variant="dark" className="justify-content-center">
        <Navbar.Brand>
          Build and Deploy React App using Json Server on Heroku
        </Navbar.Brand>
      </Navbar>
      <Container style={{ marginTop: "70px" }}>
        <Row>
          <Col md={4}>
            {/* Formulaire ajout contact */}
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Saisir votre nom"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Saisir votre email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer Contact"
                  name="contact"
                  value={contact}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer votre adresse"
                  name="adress"
                  value={adress}
                  onChange={handleChange}
                />
              </Form.Group>
              <div className="d-grid gap-2 mt-2">
                <Button type="submit" variant="primary" size="lg">
                  {editMode ? "Modifier" : " Ajouter"}
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>No. </th>
                  <th>Name</th>
                  <th>Email </th>
                  <th>Contact </th>
                  <th>Adresse</th>
                  <th>Action</th>
                </tr>
              </thead>
              {data &&
                data.map((item, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.contact}</td>
                      <td>{item.adress}</td>
                      <td>
                        <ButtonGroup>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="secondary"
                            onClick={() => handleUpdate(item.id)}
                          >
                            Update
                          </Button>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;

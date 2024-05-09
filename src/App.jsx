import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
// import { useDemoData } from '@mui/x-data-grid-generator';
import axios from "axios";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const baseURL = "http://172.16.79.153:8080/uscoia/municipio/api/v1/";
const baseURLDepartamento = "http://172.16.79.153:8080/uscoia/departamento/api/v1/";
const columns = [
  { field: "#", headerName: "#", width: 90 },
  { field: "id", headerName: "ID", width: 90 },
  { field: "departamento", headerName: "Departamento", width: 150 },
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "acronimo", headerName: "Acronimo", width: 110 },
];

export default function PageSizeCustomOptions() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [actionName, setActionName] = React.useState(null);
  const [municipios, setMunicipios] = React.useState([]);
  const [departamentos, setDepartamentos] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [openMessage, setOpenMessage] = React.useState(false);

    // atributos de la base de datos 
    const [id, setId] = React.useState(-1);
    const [departamento, setDepartamento] = React.useState(-1);
    const [nombre, setNombre] = React.useState('');
    const [acronimo, setAcronimo] = React.useState('');
  
  const actionNames = {
    ADICIONAR: "Adicionar",
    MODIFICAR: "Modificar",
    ELIMINAR: "Eliminar",
  };

  const handleClickOpen = (operacion) => {
    console.log(operacion);
    setAction(operacion);
    setActionName(actionNames[operacion]);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const recordMunicipio = {
    "departamento": departamento,
    "nombre": nombre,
    "acronimo": acronimo
  };

  function createMunicipio() {
    console.log(recordMunicipio)
    axios
      .post(baseURL,recordMunicipio )
      .then((response) => {
        console.log.date
        setOpenMessage(true);
        setMessage(response.data);
        console.log(message);
      });
  }


  const handleEdit = () => {
    console.log(action);
    if (action == "ADICIONAR") {
      createMunicipio();
    }
    setOpen(false);
  };




  const handleChangeDepartamento = (event) => {
    setDepartamento(event.target.value);
  };

  const handleChangeNombre = (event) => {
    setNombre(event.target.value);
  };

  const handleChangeAcronimo = (event) => {
    setAcronimo(event.target.value);
  };


  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setMunicipios(response.data);
      console.log(municipios);
    });
  }, []);


  React.useEffect(() => {
    axios.get(baseURLDepartamento).then((response) => {
      setDepartamentos(response.data);
      console.log(departamentos);
    });
  }, []);


  const handleCloseMessage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMessage (false);
  };

  const actionMessage = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleCloseMessage}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseMessage}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


  return (
    <div style={{ height: 400, width: "100%" }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleClickOpen("ADICIONAR")}
        >
          Adicionar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleClickOpen("MODIFICAR")}
        >
          Modificar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleClickOpen("ELIMINAR")}
        >
          Eliminar
        </Button>
      </Stack>

      <DataGrid
        rows={municipios}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Municipios</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}

          <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="departamento"
          value={departamento}
          label="Departamento"
          onChange={handleChangeDepartamento}
        >

          {departamentos.map((drow) => (
            <MenuItem key={drow.id} value={drow.id}>{drow.nombre}</MenuItem>
          ))}

        </Select>
      </FormControl>

          <TextField
            autoFocus
            margin="dense"
            id="nombre"
            value={nombre}
            label="Nombre"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChangeNombre}
          />

<TextField
            autoFocus
            margin="dense"
            id="acronimo"
            value={acronimo}
            label="Acronimo"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChangeAcronimo}
          />

          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEdit}>{actionName}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openMessage}
        autoHideDuration={2000}
        onClose={handleCloseMessage}
        message={message}
        action={actionMessage}
      />
    </div>
  );
}
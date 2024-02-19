import './App.css';

import {useState, useEffect} from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import DataTable from 'react-data-table-component'
import dayjs  from 'dayjs'

import ControlledDropdown from './ControlledDropdown'
import {API_ROOT} from './Config'

function formDataToQueryString(obj) {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value !== undefined) {
        params.append(key, value);
      }
    }
  }

  return params.toString();
}

function App() {
  const [records, setRecords] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  let [formData, setFormData] = useState([])

  // Function to add a child's state to the array
  const updateFormData = (key, value) => {
    setFormData({...formData, [key]: value})
  };

  const getRecords = () => {
     // GET Skid Weight Records
     fetch(`${API_ROOT}/extrusions/skidweights`)
     .then(response => response.json())
     .then(data => {
       setRecords(data.rows)
       setLoading(false)
     })
     .catch(error => {
       console.error('Error fetching extrusion records:', error);
       setError(error);
       setLoading(false);
     });
  }

  const getJobs = () => {
    fetch(`${API_ROOT}/extrusions/jobsList`)
    .then(response => response.json())
    .then(data => {
      setJobs(data.rows)
      setLoading(false)

      // Make each job compatible with ControlledDrowdown.js
      for(let job of data.rows)
      {
        job.name = job.epicor_job
        job.value = job.epicor_job
      }
    })
    .catch(error => {
      console.error('Error fetching jobs:', error);
      setError(error);
      setLoading(false);
    });
 }

  useEffect(() => {
   getRecords()
   getJobs()
  }, []); // This effect runs once after the initial render

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setFormData({...formData, 'amount': amount});
  }

  const validateFormData = () => {
    if (!formData.amount || !formData.shift || !formData.job) {
      alert('Please fill all required fields.\r\n (pounds, shift, job)')
      return false
    }

    if (isNaN(formData.amount) || isNaN(formData.shift)) {
      alert('Pounds & shift must be numbers')
      return false
    }

    if (formData.amount < 0) {
      alert('Pounds must be positive')
      return false
    }

    if( !parseInt(formData.shift) || formData.shift < 1 || formData.shift > 3) {
        alert('Please select a valid job and shift')
        return false
    }

    return true
  }

  const resetFormData = () => {
    window.location.reload();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return
    }

    try {
      fetch(`${API_ROOT}/extrusions/skidweights?${formDataToQueryString(formData)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then( () => {
        resetFormData()
        getRecords()
      });

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const columns = [
    {
      name: 'Date',
      selector: row => dayjs(row.created).format(`MM/DD/YYYY`),
      sortable: true,
      reorder: true
    },
    {
      name: 'Shift',
      selector: row => row.shift,
      sortable: true,
      reorder: true,
      width: 88
    },
    {
      name: 'Pounds',
      selector: row => row.pounds,
      sortable: true,
      reorder: true,
      width: 88
    },
    {
      name: 'Job',
      selector: row => row.job,
      sortable: true,
      reorder: true,
      width: 88
    },
  ]

  const renderDataTable = () => {
    if(loading) {
      return <div>Loading...</div>
    } else if (error) {
      return <div>Error: {error.message}</div>
    } else if (records.length) {
      return(
        <DataTable
          columns={columns}
          data={records}
          pagination
        />
    )} else {
      return <div>No records found.</div>
    }
  }

  return (
    <div className="App">
      <Navbar>
        <Col>
          <Navbar.Brand>SPP Skid Weight Tracker</Navbar.Brand>
        </Col>
        <Col className="ml-auto">
          <img
                alt=""
                src="/spp.logo.png"
                width="150"
                height="100"
                className="d-inline-block align-top"
          />{' '}
          </Col>
      </Navbar>
      <Form>
        <InputGroup className={'input-group'}> {/*Amount*/}
          <InputGroup.Text className={'scrap-label'} id="scrap-amount">Skid Weight *</InputGroup.Text>
          <Form.Control
            placeholder = "(pounds)"
            aria-label = "Scrap Amount *"
            aria-describedby = "scrap-amount"
            className = {'wide-value-field'}
            onChange = {handleAmountChange}
            initialValue={formData.amount}
            required={true}
          />
        </InputGroup>
        <ControlledDropdown
          options = {[
            {name:`6am - 2pm`, value: 1}, 
            {name: `2pm - 10pm`, value: 2}, 
            {name: `10pm - 6am`, value: 3}]}
          label = {`Shift *`}
          id = {`shift`}
          updateFormData={updateFormData}
          initialValue={formData.shift}
          required={true}
         />
         <ControlledDropdown
          options = { jobs || [] }
          label = {`Job *`}
          id = {`job`}
          updateFormData={updateFormData}
          initialValue={formData.epicor_job}
          onChange = {handleAmountChange}
          required={true}
         />
        
      </Form>
      <Form >
        <Row>
          <Col xs="auto">
            <Button onClick={resetFormData} variant="danger">Clear</Button>
          </Col>
          <Col xs="auto">
            <Button onClick={handleSubmit}>Submit</Button>  
          </Col>
        </Row>
      </Form>
        {renderDataTable()}
    </div>
  );
}

export default App;
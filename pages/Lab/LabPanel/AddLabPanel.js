import {useState, useEffect} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Cookies from 'universal-cookie';
import {useAuth} from '../../context/AuthContext'
import SideNavbar from '../../components/SideNavbar.js'
import Header from '../../components/Header'
import { useRouter } from 'next/router'
import styles from '../../../styles/Home.module.css'
import api from '../../components/api'
export default function AddLabPanel() {
   const router = useRouter();
   const {currentUser} = useAuth()
    useEffect(()=>{
        if(!currentUser){
            router.push('/login')
        }else{
         
        }
    },[currentUser, router])
   const [panelsAbbreviation, setpanelsAbbreviation] = useState("")
   const [shortDescription, setshortDescription] = useState("")
   const [price, setprice] = useState("")
   const [departmentId, setdepartmentId] = useState("")
   const cookies = new Cookies();
   const accesstoken = cookies.get('token')
   const authaxios = axios.create({
      baseURL : api,
      headers :{
         Authorization : `Bearer ${accesstoken} `
      }
   })
   
   const handlesubmit = async (e)=>{
      e.preventDefault()
      setdepartmentId(1)
      await authaxios.post(`${api}/labpanel`,{
         panelsAbbreviation:panelsAbbreviation,
         shortDescription:shortDescription,
         price:parseInt(price),
         departmentId:parseInt(departmentId)
      }).then(function (response) {
         console.log(response)
         router.push('/Lab/LabPanel/LabPanel')
      }).catch(function (error) {
         console.log(error);
      });
   }
   return (
      <div className={styles.home}>
         <SideNavbar />
         <div className={styles.homeContainer}>
            <Header />
            <form onSubmit={handlesubmit} className="m-3 bg-white border rounded">
               <Container className="p-3">

                  <Row className="mb-3">
                     <Col sm>
                        <FloatingLabel controlId="floatingInput" label="panels Abbreviation">
                           <Form.Control 
                              type="text" 
                              placeholder="panels Abbreviation"
                              required
                              value = {panelsAbbreviation}
                              onChange={(e) => setpanelsAbbreviation(e.target.value)}
                           />
                        </FloatingLabel>
                     </Col>

                     <Col>
                        <FloatingLabel controlId="floatingSelect" label="Department">
                           <Form.Select 
                              aria-label="Floating label select example"
                              value = {departmentId}
                              onChange={(e) => setdepartmentId(e.target.value)}
                           >
                              <option></option>
                              <option value={1}>Leave</option>
                              <option value={2}>Stay</option>
                              <option value="3">Three</option>
                           </Form.Select>
                        </FloatingLabel>
                     </Col>

                     <Col>

                        <FloatingLabel controlId="floatingInput" label="price">
                           <Form.Control 
                              type="text" 
                              placeholder="price"
                              required
                              value = {price}
                              onChange={(e) => setprice(e.target.value)}
                           />
                        </FloatingLabel>
                     </Col>


                  </Row>

                  <Row className="mb-3">
                     <Col sm>
                        <FloatingLabel controlId="floatingTextarea2" label="shortDescription">
                              <Form.Control
                                 as="textarea"
                                 required
                                 placeholder="shortDescription"
                                 style={{ height: '200px' }}
                                 value={shortDescription}
                                 onChange={(e) => setshortDescription(e.target.value)}
                              />
                           </FloatingLabel>
                     </Col>
                  </Row>   
                     
                  <Button className="mb-3" type="submit" variant="primary">Submit</Button>
               </Container>
            </form >
         </div>
      </div>
  )
}


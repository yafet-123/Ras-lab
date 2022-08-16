import { useState,useEffect, useContext} from 'react'
import Image from 'next/image'
import axios from "axios";
import Link from "next/link";
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router'
import moment from 'moment';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import {useAuth} from '../../context/AuthContext'
import SideNavbar from '../../components/SideNavbar.js'
import Header from '../../components/Header'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import styles from '../../../styles/Home.module.css'
import api from '../../components/api'


export async function getServerSideProps(context) {
	const {params,req,res,query} = context
	const token = req.cookies.token
	if (!token) {
    	return {
      		redirect: {
        		destination: '/login',
        		permanent: false,
      		},
      	}
    }
	const accesstoken = token
	const apiURL = "https://hmsapiserver.herokuapp.com/api/v1"
	const authaxios = axios.create({
		baseURL : apiURL,
		headers :{
			Authorization : `Bearer ${accesstoken} `
		}
	})
	const data = await authaxios.get(`${apiURL}/labpanel/`)
  	return {
    	props: {
    		labpanel:data.data,
    	}, // will be passed to the page component as props
  	}
}

export default function LabPanel({labpanel}) {
	const router = useRouter();
	const {currentUser} = useAuth()
	const [getSearchValue,setgetSearchValue] = useState("")

	const [panelsAbbreviation, setpanelsAbbreviation] = useState("")
   	const [shortDescription, setshortDescription] = useState("")
   	const [price, setprice] = useState("")
   	const [departmentId, setdepartmentId] = useState("")
   	const [Name, setName] = useState("")
   	const [id,setid] = useState("")

   	const cookies = new Cookies();
   	const accesstoken = cookies.get('token')
   	const apiURL = "https://hmsapiserver.herokuapp.com/api/v1"
   	const authaxios = axios.create({
    	baseURL : apiURL,
      	headers :{
         	Authorization : `Bearer ${accesstoken} `
      	}
   	})

   	const handleupdate = async (e)=>{
      	e.preventDefault()
      	await authaxios.patch(`${apiURL}/labpanel/${id}`,{
      		panelsAbbreviation:panelsAbbreviation,
			shortDescription:shortDescription,
			price:parseInt(price),
			departmentId:parseInt(departmentId),
			"isActive": true
      	}).then(function (response) {
         	console.log(response)
         	router.reload()
      	}).catch(function (error) {
         	console.log(error);
      	});
   	}

   	console.log(id)
    const handleDelete = async (e)=>{
      	e.preventDefault()
      	
      	await authaxios.patch(`${apiURL}/labpanel/${id}`,{
         	id:parseInt(id),
      	}).then(function (response) {
         	console.log(response)
         	router.reload()
      	}).catch(function (error) {
         	console.log(error);
      	});
   	}

	const [show3, setShow3] = useState(false);
  	const handleClose3 = () => setShow3(false);
  	const handleShow3 = () => setShow3(true);


  	const [show2, setShow2] = useState(false);
  	const handleClose2 = () => setShow2(false);
  	const handleShow2 = () => setShow2(true);
    useEffect(()=>{
        if(!currentUser){
            router.push('/login')
        }else{
        	
        }
    },[currentUser, router])
	return(
		<div className={styles.home}>
			<SideNavbar />
			<div className={styles.homeContainer}>
                <Header />
				<div className="container">
				    <div id="no-more-tables">
				    	<InputGroup className="p-3">
					        <Form.Control
					        	placeholder="Search By Name"
					          	aria-label="Search"
					          	aria-describedby="basic-addon1"
					          	className="w-25"
					          	valiue={getSearchValue}
								onChange={(e) => setgetSearchValue(e.target.value)}
					        />      
					    </InputGroup>

					    <table className="table table table-light table-hover  col-md-12 cf">
					      	<thead className="cf bg-white">
					       		<tr>
					       			<th scope="col">Id</th>
					       			<th scope="col">Name</th>
					       			<th scope="col">Description</th>
					        		<th scope="col">Department</th>
					        		<th scope="col">Price</th>
					        		<th scope="col"></th>
					        		<th scope="col"></th>
					        	</tr>
					        </thead>
					       	<tbody>
					       		{labpanel.filter((val)=>{
					       			if(getSearchValue == ""){
					       				return val
					       			}else if(val.Name.toLowerCase().includes(getSearchValue.toLowerCase())){
					        			return val
					        		}
					       		}).map((data,index)=>(
						      		<tr key={index} className="bg-white p-3">
						      			<td data-title="Id" scope="row" >{data.id}</td>
						      			<td data-title="Name" >{data.Name}</td>
						      			<td data-title="Abbreviation" >{data.Description}</td>
						      			<td data-title="Description" >{data.Department}</td>
						      			<td data-title="Unit Of Measurement" >{data.Price}</td>
						      			<td>
						        			<Button variant="warning" onClick={(index)=>{
						        				handleShow2()
						        				setpanelsAbbreviation(data.Name)
												setshortDescription(data.Description)
												setprice(data.Price)
												setdepartmentId(data.Department)
						        				setid(data.id)
						        			}}>
						        				Update
     						 				</Button>
     						 						
										</td>

										<td>
						        			<Button variant="danger" onClick={(index)=>{
						        				handleShow3()
						        				setName(data.Name)
						        				setid(data.id)
						        			}}>
						        				Delete
     						 				</Button>
     						 				
										</td>

						      		</tr>
						      	))}
						      	<Modal size="lg" show={show2} onHide={handleClose2} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
								<Modal.Header closeButton>
									<Modal.Title>Detail Page</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<div className="m-3 bg-white">
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
						                  
						               </Container>
						            </div >
								</Modal.Body>
								<Modal.Footer>
									<Button onClick={handleupdate} type="submit" variant="primary">Submit</Button>

									<Button variant="secondary" onClick={handleClose2}>
										Close
									</Button>
								</Modal.Footer>
							</Modal>

							<Modal size="lg" show={show3} onHide={handleClose3} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
								<Modal.Header closeButton>
									<Modal.Title>Modal title</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									Do you want to delete <span className="fs-5 text-danger"> {Name}</span>
								</Modal.Body>
								<Modal.Footer>
									<Button onClick={handleDelete}variant="danger">
										yes
									</Button>
									<Button variant="secondary" onClick={handleClose3}>
										Close
									</Button>
								</Modal.Footer>
							</Modal>
					       	</tbody>
					    </table>
				    </div>
				</div>
			</div>
		</div>
	)
}
const Appointment = require('../models/appointment');
const Conversation = require('../models/conversation');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');


const mongoose = require('mongoose');

const getMyPatients = async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
       query = {
                 '$or': [
                        {
                            'patient.fullName': {
                                '$regex': search, 
                                '$options': 'i'
                            }
                        }
                  ]
               }
    }
    const patients = await Appointment.aggregate(
        [
            {
               $match: { doctorId: new mongoose.Types.ObjectId(req.userId) }
            } ,
            {
                '$lookup': {
                'from': 'doctors', 
                'localField': 'doctorId', 
                'foreignField': '_id', 
                'as': 'doctor'
                }
            },
            {
                '$unwind': {
                'path': '$doctor'
                }
            },
            {
                '$lookup': {
                'from': 'patients', 
                'localField': 'patientId', 
                'foreignField': '_id', 
                'as': 'patient'
                }
            },
            {
                '$unwind': {
                'path': '$patient'
                }
            },
            {
                '$project': {
                'doctor': 1, 
                'patient': 1, 
                'doctorId': 1, 
                'patientId': 1
                }
            },
            {
                '$match': query
            } ,
            {
                $project: {
                    doctorId: 1,
                    patientId: 1,
                    patient: 1,
                    _id : 1 ,
                    patient: {
                        name: 1,
                        fullName: 1 ,
                        email: 1,
                        profilePicture: 1
                    }
                }
            }
        ]
    )
    
  
    // for removing the duplicates of patients
    const myPatients = []
    const uniquePatientIds = new Set();
  

    patients.forEach((patient) => {
      if (!uniquePatientIds.has(patient.patientId.toString())) {
        uniquePatientIds.add(patient.patientId.toString());
        
        myPatients.push(patient);
      }
    });

  
    res.status(200).json({ myPatients });
  
}

const getMyDoctors = async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query = {
                    '$or': [
                        {
                        'doctor.fullName': {
                            '$regex': search, 
                            '$options': 'i'
                        }
                        }
                    ]
        }
    }
    const doctors = await Appointment.aggregate(
        [
            {
               $match: { patientId: new mongoose.Types.ObjectId(req.userId) }
            },
            {
                '$lookup': {
                'from': 'doctors', 
                'localField': 'doctorId', 
                'foreignField': '_id', 
                'as': 'doctor'
                }
            },
            {
                '$unwind': {
                'path': '$doctor'
                }
            },
            {
                '$match': query
            },
            {
                $project: {
                    doctorId: 1,
                    patientId: 1,
                    patient: 1,
                    doctor: {
                        name: 1,
                        fullName: 1,
                        email: 1,
                        profilePicture: 1
                    }
                }
            }
        ]
    )
  
    const myDoctors = []
    const uniqueDoctorIds = new Set();
  

    doctors.forEach((doctor) => {
      if (!uniqueDoctorIds.has(doctor.doctorId.toString())) {
        uniqueDoctorIds.add(doctor.doctorId.toString());
        myDoctors.push(doctor);
      }
    });

    res.json({ myDoctors });
  
}

const createDoctorConversation = async (req, res) => {
  {
  try {
    const { doctorId } = req.params;

      console.log(`doctor id ${doctorId}`)
      console.log(`pateint id ${req.userId}`)


    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(req.userId);

    if (!doctor || !patient) {
      return res.status(404).json({ error: 'Doctor or patient not found' });
    }

    // Check if the conversation already exists
    let conversation = await Conversation.findOne({
      'participants.doctor': doctorId,
      'participants.patient': req.userId,
    });

    if (conversation) {
      await conversation
        .populate([
            {
                path: 'participants.patient' ,
                select: 'profilePicture name fullName'
            },
            {
                path: 'participants.doctor',
                select: 'profilePicture name fullName'
            }
        ])
        
      return res.status(200).json(conversation);
    }

    conversation = new Conversation({
      participants: [{ doctor: doctorId, patient: req.userId }],
    });

    await conversation.save();

    await conversation.populate('participants.doctor participants.patient');

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}
}

const createPatientConversation =  async (req, res) => {
  {
  try {
    const { patientId } = req.params;


    const doctor = await Doctor.findById(req.userId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({ error: 'Doctor or patient not found' });
    }

    // Check if the conversation already exists
    let conversation = await Conversation.findOne({
      'participants.doctor': req.userId,
      'participants.patient': patientId,
    });

    if (conversation) {
      await conversation
        .populate([
            {
                path: 'participants.patient' ,
                select: 'profilePicture name fullName'
            },
            {
                path: 'participants.doctor',
                select: 'profilePicture name fullName'
            }
        ])
        
      return res.status(200).json(conversation);
    }

    conversation = new Conversation({
      participants: [{ doctor: req.userId, patient: patientId }],
    });

    await conversation.save();

    await conversation.populate([
        {
            path: 'participants.patient' ,
            select: 'profilePicture fullName email'
        },
        {
            path: 'participants.doctor',
            select: 'profilePicture fullName email'
        }
    ]);

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}
}

const getMyChat = async (req, res) => {
    try {
        
        const loggedInUserId = new mongoose.Types.ObjectId(req.userId);
        console.log(loggedInUserId)

        const conversations = await Conversation.find({
                participants: {
                    $elemMatch: { $or: [{ doctor: loggedInUserId }, { patient: loggedInUserId }] }
                }
        })
            .populate([
                {
                    path: 'participants.doctor',
                    select: 'profilePicture name fullName email'
                }, 
                {
                    path: 'participants.patient',
                    select: 'profilePicture name fullName email'
                },
                {
                    path: 'latestMessage'
                }
            ]);
        
        if (conversations.length === 0) {
             return res.status(404).json({ error: 'No conversations found' });
        }

        return res.status(200).json(conversations);

  } catch (error) {
    console.error('Error retrieving conversations:', error);
    return res.status(500).json({ errorInfo: 'Failed to retrieve conversations' });
  }
}

module.exports = {
    getMyPatients,
    getMyDoctors,
    createDoctorConversation,
    createPatientConversation,
    getMyChat
}
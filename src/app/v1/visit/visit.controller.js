import { error } from 'console';
import visitModel from './visit.model';

export const registerVisit = async (req, res) => {
  const { user } = req.body;
  try {

    let visit = await visitModel.findOne({ user });

    if (visit) {
      visit.visits += 1;
    } else {
      visit = new visitModel({
        visits: 1,
        user: user || 'unregistered',
      });
    }

    await visit.save();

    return res.status(200).json({
      success: true,
      message: 'Visita registrada exitosamente',
      visit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error al registrar la visita',
      error: error.message,
    });
  }
};

export const getVisits = async (req, res) => {
  try {
    const visits = await visitModel.find();
    return res.status(200).json({
      success: true,
      error: false,
      data: visits
    })
  }
   catch (error) {
    return res.status(500).json({
      success: true,
      error: false,
      message: err.message || err,
    })
  }
}

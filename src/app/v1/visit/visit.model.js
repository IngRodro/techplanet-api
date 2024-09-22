
import mongoose from 'mongoose';
import getModelName from 'Utils/getModelName';

const { Schema } = mongoose;
export const { singularName, pluralName } = getModelName('visit');

const visit = new Schema(
  {
    visits: {
      type: Number,
      require: true
    },
    user: {
      unique: true,
      type: String,
      require: true,
      default: 'unregistered',
    }
  },
  {
    versionKey: false,
  }
);

// Ensure virtual fields are serialised.
visit.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
  },
});

// rename name Example to singular Model
export default mongoose.models[singularName] ||
  mongoose.model(pluralName, visit);

// lib/serialization.ts
import mongoose from 'mongoose';

export function toPlainObject(doc: any): any {
  if (!doc) return null;
  
  // Handle Mongoose documents
  if (doc instanceof mongoose.Document) {
    return doc.toObject({ flattenObjectIds: true });
  }
  
  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(item => toPlainObject(item));
  }
  
  // Handle objects
  if (typeof doc === 'object' && doc !== null) {
    const result: any = {};
    for (const key in doc) {
      if (doc.hasOwnProperty(key)) {
        // Convert ObjectId to string
        if (doc[key] instanceof mongoose.Types.ObjectId) {
          result[key] = doc[key].toString();
        } 
        // Handle nested objects
        else if (typeof doc[key] === 'object' && doc[key] !== null) {
          result[key] = toPlainObject(doc[key]);
        } 
        // Handle other properties
        else {
          result[key] = doc[key];
        }
      }
    }
    return result;
  }
  
  // Return primitives as-is
  return doc;
}

export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && 
         /^[0-9a-fA-F]{24}$/.test(id);
}

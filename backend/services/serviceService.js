import { connectToDatabase } from '@/backend/config/db';
import Service from '@/backend/models/Service';
import { logAdminActivity } from '@/backend/lib/auth';
import { fallbackServices } from '@/lib/fallbackData';

export const serviceService = {
  async getPublishedServices() {
    try {
      await connectToDatabase();
      const services = await Service.find({ isPublished: true }).sort({ displayOrder: 1 }).lean();
      return (services && services.length) ? services : fallbackServices;
    } catch {
      return fallbackServices;
    }
  },

  async getServiceBySlug(slug) {
    try {
      await connectToDatabase();
      const service = await Service.findOne({ slug, isPublished: true }).lean();
      if (service) return service;
    } catch {
      // Fallback
    }

    const fallback = fallbackServices.find((s) => s.slug === slug);
    if (fallback) return fallback;
    throw new Error('Service not found');
  },

  async getAllServicesAdmin() {
    await connectToDatabase();
    return Service.find({}).sort({ displayOrder: 1 }).lean();
  },

  async createService(data, adminEmail, req) {
    await connectToDatabase();
    const service = await Service.create(data);
    await logAdminActivity({
      adminEmail,
      action: 'CREATE_SERVICE',
      entity: 'Service',
      entityId: service._id,
      summary: `Created service: ${service.title}`,
      req,
    });
    return service;
  },

  async updateService(id, data, adminEmail, req) {
    await connectToDatabase();
    const service = await Service.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!service) throw new Error('Service not found');

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_SERVICE',
      entity: 'Service',
      entityId: id,
      summary: `Updated service: ${service.title}`,
      req,
    });
    return service;
  },

  async deleteService(id, adminEmail, req) {
    await connectToDatabase();
    const service = await Service.findByIdAndDelete(id);
    if (!service) throw new Error('Service not found');

    await logAdminActivity({
      adminEmail,
      action: 'DELETE_SERVICE',
      entity: 'Service',
      entityId: id,
      summary: `Deleted service: ${service.title}`,
      req,
    });
    return true;
  },
};

export default serviceService;

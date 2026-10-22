import { connectToDatabase } from '@/backend/config/db';
import NriItem from '@/backend/models/NriItem';
import { logAdminActivity } from '@/backend/lib/auth';

export const initialNriItems = [
  {
    title: 'Who is a Non-Resident Indian (NRI)?',
    description:
      'A non-resident Indian (NRI) is an Indian citizen or a person of Indian origin who stays abroad for employment, business or vocation outside India, or stays abroad under circumstances indicating an uncertain duration.',
    order: 1,
    isPublished: true,
  },
  {
    title: 'Who is a Person of Indian Origin (PIO)?',
    description:
      'A Person of Indian Origin means a citizen of any country (other than Bangladesh or Pakistan), if the person: (a) at any time held an Indian passport; or (b) or the persons parents or grandparents were citizens of India; or (c) is a spouse of an Indian citizen, or of a person referred to in (a) or (b) above.\n\nOther terms with vaguely the same meaning are overseas Indian and expatriate Indian. In common usage, this often includes Indian-born individuals (and also people of other nations with Indian ancestry) who have taken the citizenship of other countries.\n\nAccording to Ministry of Overseas Indian Affairs, India has the second largest diaspora in the world after Overseas Chinese . The overseas Indian community estimated at over 25 million is spread across every major region in the world.',
    order: 2,
    isPublished: true,
  },
  {
    title: 'Who is a Foreign Institutional Investor (FII)?',
    description:
      'An FII is an institution established or incorporated outside India which proposes to invest in Indian securities and is registered with SEBI.',
    order: 3,
    isPublished: true,
  },
  {
    title: 'Who is an Overseas Corporate Body (OCB) ?',
    description:
      'An OCB includes overseas companies, partnership firms, societies and other corporate bodies owned predominantly by non-resident persons of Indian nationality or origin outside India.',
    order: 4,
    isPublished: true,
  },
  {
    title: 'Can an NRI maintain a bank account in India?',
    description:
      'Yes. NRIs can maintain accounts in rupees as well as in foreign currency.',
    order: 5,
    isPublished: true,
  },
  {
    title: 'What types of rupee accounts may NRIs maintain?',
    description:
      'There are 4 types:\n1. Non-resident (External) Rupee Accounts (NRE)\n2. Non-Resident (Special) Rupee (NRSR) Account\n3. Ordinary Non-resident Rupee Accounts (NRO)\n4. Non-resident (Non-repatriable) Rupee deposit accounts (NRNR)',
    order: 6,
    isPublished: true,
  },
  {
    title: 'What are NRE, NRO and FCNR accounts?',
    description:
      'Non-Resident (External) Rupee (NRE). This is a Rupee account from which funds are freely repatriable. It can be opened with either funds remitted from abroad or local funds which can be remitted abroad.\n\nNon-Resident Ordinary Rupee (NRO). This is a Rupee account and can be opened with funds either remitted from abroad or generated in India. These funds are non-repatriable. However, under certain circumstances, these are allowed to be repatriated.\n\nFully Convertible Non-Resident Rupee (FCNR). This account is similar to the NRE account except that the funds are held in foreign currencies and can be maintained in Pound Sterling, U.S. Dollar, Euro and Japanese Yen. FCNR accounts can be maintained only in the form of term deposits, i.e. a deposit kept for fixed periods ranging from 6 months to 3 years.',
    order: 7,
    isPublished: true,
  },
  {
    title: 'How do NRE, NRO and NRSR accounts differ?',
    description:
      'Balances held in NRE accounts can be repatriated abroad freely, whereas funds in NRSR and NRO account cannot be normally remitted abroad but have to be used only for local payments in rupees. Consequently, funds remitted from abroad or local funds which can otherwise be remitted abroad to the accountholder can only be credited to NRE accounts.',
    order: 8,
    isPublished: true,
  },
  {
    title: 'Mutual Funds & Taxation Advisory for NRIs',
    description:
      'We at Finasset Wealth advise on Mutual Funds and other investment options for NRIs also. We also advise on taxation for NRIs who invest in Mutual funds or any other investment options in India as they have different taxation in different countries.',
    order: 9,
    isPublished: true,
  },
];

async function ensureSeedData() {
  const count = await NriItem.countDocuments();
  if (count === 0) {
    try {
      await NriItem.insertMany(initialNriItems);
    } catch (e) {
      console.warn('Failed to auto-seed initial NRI items:', e.message);
    }
  }
}

export const nriService = {
  async getPublishedNriItems() {
    await connectToDatabase();
    await ensureSeedData();
    const items = await NriItem.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
    return items || [];
  },

  async getAllNriItemsAdmin() {
    await connectToDatabase();
    await ensureSeedData();
    const items = await NriItem.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return items || [];
  },

  async createNriItem(data, adminEmail, req) {
    await connectToDatabase();
    const item = await NriItem.create({
      title: data.title?.trim(),
      description: data.description?.trim(),
      order: Number(data.order) || 0,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });

    await logAdminActivity({
      adminEmail,
      action: 'CREATE_NRI_ITEM',
      entity: 'NriItem',
      entityId: item._id,
      summary: `Created NRI Corner topic: "${item.title}"`,
      req,
    });

    return item;
  },

  async updateNriItem(id, data, adminEmail, req) {
    await connectToDatabase();
    const updatePayload = {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isPublished !== undefined && { isPublished: Boolean(data.isPublished) }),
    };

    const item = await NriItem.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!item) {
      throw new Error('NRI topic not found');
    }

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_NRI_ITEM',
      entity: 'NriItem',
      entityId: item._id,
      summary: `Updated NRI Corner topic: "${item.title}"`,
      req,
    });

    return item;
  },

  async deleteNriItem(id, adminEmail, req) {
    await connectToDatabase();
    const item = await NriItem.findByIdAndDelete(id);
    if (!item) {
      throw new Error('NRI topic not found');
    }

    await logAdminActivity({
      adminEmail,
      action: 'DELETE_NRI_ITEM',
      entity: 'NriItem',
      entityId: id,
      summary: `Deleted NRI Corner topic: "${item.title}"`,
      req,
    });

    return true;
  },
};

export default nriService;

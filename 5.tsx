import React from 'react';
import { 
  BiHomeAlt, 
  BiCheckSquare, 
  BiVideo, 
  BiBuildings, 
  BiPurchaseTag, 
  BiBadgeCheck, 
  BiWallet, 
  BiSupport, 
  BiLogOut, 
  BiChevronLeft, 
  BiSearch, 
  BiBell, 
  BiPlus,
  BiFile,
  BiBook,
  BiCheckShield,
  BiStar,
  BiTrash,
  BiPencil,
  BiSolidCertification
} from 'react-icons/bi';
import { 
  FaGraduationCap,
  FaCircle
} from 'react-icons/fa';

// Sidebar items configuration
const SIDEBAR_ITEMS = [
  { id: 'home', label: 'الرئيسية', icon: BiHomeAlt, active: false },
  { id: 'approvals', label: 'الموافقات', icon: BiCheckSquare, active: false },
  { id: 'certificates', label: 'الشهادات', icon: BiSolidCertification, active: true },
  { id: 'live', label: 'الحصص المباشرة', icon: BiVideo, active: false },
  { id: 'accounts', label: 'إدارة الحسابات', icon: BiBuildings, active: false },
  { id: 'prices', label: 'الأسعار', icon: BiPurchaseTag, active: false },
  { id: 'subscriptions', label: 'الاشتراكات', icon: BiBadgeCheck, active: false },
  { id: 'payments', label: 'المدفوعات', icon: BiWallet, active: false },
  { id: 'support', label: 'خدمة العملاء', icon: BiSupport, active: false },
];

// Timeline Data
type TimelineItemType = 'chapter' | 'exam' | 'comprehensive';
type StatusType = 'published' | 'draft';

interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  label?: string;
  meta: string;
  status?: StatusType;
  examTypeLabel?: string;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    id: '1',
    type: 'chapter',
    label: 'F1',
    title: 'الفصل الأول: الإطار النظري للمحاسبة المالية',
    meta: '4 دروس',
    status: 'published'
  },
  {
    id: '2',
    type: 'chapter',
    label: 'F2',
    title: 'الفصل الثاني: القوائم المالية وعناصرها',
    meta: '6 دروس',
    status: 'published'
  },
  {
    id: '3',
    type: 'exam',
    title: 'Simulated Exam (F1 + F2)',
    meta: '60 دقيقة • 40 سؤال',
    status: 'published',
    examTypeLabel: 'اختبار مرحلي'
  },
  {
    id: '4',
    type: 'chapter',
    label: 'F3',
    title: 'الفصل الثالث: الأصول المتداولة والقياس',
    meta: '5 دروس',
    status: 'published'
  },
  {
    id: '5',
    type: 'chapter',
    label: 'F4',
    title: 'الفصل الرابع: الأصول غير المتداولة والاستهلاك',
    meta: '7 دروس',
    status: 'draft'
  },
  {
    id: '6',
    type: 'exam',
    title: 'Simulated Exam (F3 + F4)',
    meta: '60 دقيقة • 40 سؤال',
    status: 'draft',
    examTypeLabel: 'اختبار مرحلي'
  },
  {
    id: '7',
    type: 'chapter',
    label: 'F5',
    title: 'الفصل الخامس: الالتزامات قصيرة وطويلة الأجل',
    meta: '4 دروس',
    status: 'draft'
  },
  {
    id: '8',
    type: 'chapter',
    label: 'F6',
    title: 'الفصل السادس: حقوق الملكية والتغيرات',
    meta: '3 دروس',
    status: 'draft'
  },
  {
    id: '9',
    type: 'chapter',
    label: 'F7',
    title: 'الفصل السابع: قائمة التدفقات النقدية',
    meta: '5 دروس',
    status: 'draft'
  },
  {
    id: '10',
    type: 'exam',
    title: 'Simulated Exam (F5 + F6 + F7)',
    meta: '90 دقيقة • 60 سؤال',
    status: 'draft',
    examTypeLabel: 'اختبار مرحلي'
  },
  {
    id: '11',
    type: 'comprehensive',
    title: 'Simulated Exam شامل – نموذج 1',
    meta: '120 دقيقة • 100 سؤال',
    status: 'published',
    examTypeLabel: 'اختبار شامل'
  },
  {
    id: '12',
    type: 'comprehensive',
    title: 'Simulated Exam شامل – نموذج 2',
    meta: '120 دقيقة • 100 سؤال',
    status: 'published',
    examTypeLabel: 'اختبار شامل'
  }
];

export default function MaterialStructurePage() {
  return (
    <div className="min-h-[900px] w-[1440px] bg-[#F5F7FA] font-['Cairo'] flex" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-l border-[#E2E8F0] flex flex-col shrink-0 h-full">
        <div className="h-20 flex items-center px-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <FaGraduationCap className="w-6 h-6" />
            </div>
            <span className="font-black text-xl text-[#0F172A]">Taleb Elm</span>
          </div>
        </div>

        <div className="py-6 px-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all font-bold text-[15px] relative ${
                item.active 
                  ? "bg-[#EFF6FF] text-[#1877F2]" 
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
              }`}
            >
              {item.active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#1877F2] rounded-l-md" />
              )}
              <item.icon className={`w-[22px] h-[22px] ${item.active ? "text-[#1877F2]" : "text-[#94A3B8]"}`} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
        
        <div className="p-4 border-t border-[#E2E8F0] mt-auto">
          <button className="flex items-center gap-3 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors w-full px-4 py-3.5 rounded-xl">
            <BiLogOut className="w-[22px] h-[22px]" />
            <span className="text-sm font-bold">تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            <a href="#" className="text-[#1877F2] font-bold hover:bg-[#EFF6FF] px-2 py-1 rounded-lg transition-colors">
              الشهادات
            </a>
            <BiChevronLeft className="text-[#CBD5E1] w-5 h-5" />
            <span className="text-[#64748B] font-bold px-2 py-1">
              SOCPA
            </span>
            <BiChevronLeft className="text-[#CBD5E1] w-5 h-5" />
            <span className="text-[#64748B] font-bold px-2 py-1">
              المواد
            </span>
            <BiChevronLeft className="text-[#CBD5E1] w-5 h-5" />
            <span className="text-[#64748B] font-bold px-2 py-1">
              المحاسبة المالية
            </span>
            <BiChevronLeft className="text-[#CBD5E1] w-5 h-5" />
            <span className="text-[#0F172A] font-bold bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#DBEAFE]">
              هيكل المادة
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-[#94A3B8] hover:text-[#1877F2] hover:bg-[#EFF6FF] rounded-full transition-all">
              <BiBell className="w-6 h-6" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
            </button>

            <div className="h-8 w-px bg-[#E2E8F0]" />

            <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 hover:bg-[#F8FAFC] rounded-full transition-all border border-transparent hover:border-[#E2E8F0]">
              <div className="text-left">
                <div className="text-sm font-bold text-[#0F172A]">Admin User</div>
                <div className="text-[10px] text-[#64748B] font-bold">مدير النظام</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 overflow-hidden ring-2 ring-[#F1F5F9]">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                  alt="User" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto pb-20">
            
            {/* Page Title & Actions */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h1 className="text-[32px] font-black text-[#0F172A] mb-2 leading-tight">
                  هيكل مادة: المحاسبة المالية
                </h1>
                <p className="text-[#64748B] text-lg font-medium">
                  قم بإدارة هيكل الدورة التدريبية من خلال تنظيم الفصول والاختبارات المحاكية
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="h-11 px-5 rounded-xl font-bold text-sm bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:border-[#CBD5E1] transition-all flex items-center gap-2 shadow-sm">
                  <BiFile className="w-5 h-5" />
                  <span>معاينة الهيكل</span>
                </button>
                <button className="h-11 px-6 rounded-xl font-bold text-sm bg-[#1877F2] text-white hover:bg-[#1565D8] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                  <BiPlus className="w-5 h-5" />
                  <span>إضافة عنصر جديد</span>
                </button>
              </div>
            </div>

            {/* Timeline Container */}
            <div className="relative pl-10">
              {/* Vertical Dashed Line */}
              <div className="absolute top-6 bottom-0 right-[27px] w-px border-r-2 border-dashed border-[#E2E8F0]" />

              <div className="space-y-6">
                {TIMELINE_DATA.map((item, index) => (
                  <div key={item.id} className="relative flex items-start gap-8 group">
                    
                    {/* Timeline Node Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      {item.type === 'chapter' && (
                        <div className="w-14 h-14 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center text-[#64748B] shadow-sm">
                          <BiBook className="w-6 h-6" />
                        </div>
                      )}
                      {item.type === 'exam' && (
                        <div className="w-14 h-14 rounded-full bg-white border-2 border-[#1877F2] flex items-center justify-center text-[#1877F2] shadow-sm ring-4 ring-[#EFF6FF]">
                          <BiCheckShield className="w-7 h-7" />
                        </div>
                      )}
                      {item.type === 'comprehensive' && (
                        <div className="w-14 h-14 rounded-full bg-[#FFFBEB] border-2 border-[#F59E0B] flex items-center justify-center text-[#F59E0B] shadow-sm ring-4 ring-[#FFF7ED]">
                          <BiStar className="w-7 h-7" />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div 
                      className={`flex-1 rounded-2xl border transition-all duration-200 p-5 flex items-center justify-between
                        ${item.type === 'comprehensive' 
                          ? 'bg-white border-[#FEF3C7] shadow-[0_2px_8px_rgba(245,158,11,0.05)] hover:shadow-[0_4px_12px_rgba(245,158,11,0.1)]' 
                          : item.type === 'chapter'
                            ? 'bg-white border-[#E2E8F0] shadow-sm cursor-pointer hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 hover:border-[#DBEAFE] hover:bg-[#F8FAFC] active:scale-[0.98] active:border-[#1877F2]'
                            : 'bg-white border-[#E2E8F0] shadow-sm hover:shadow-md'
                        }
                      `}
                      role={item.type === 'chapter' ? 'button' : undefined}
                      tabIndex={item.type === 'chapter' ? 0 : undefined}
                      aria-label={item.type === 'chapter' ? `فتح ${item.title}` : undefined}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Chapter Label */}
                        {item.type === 'chapter' && (
                          <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center font-black text-[#64748B] text-lg transition-colors group-hover:bg-[#EFF6FF] group-hover:text-[#1877F2] group-hover:border-[#DBEAFE]">
                            {item.label}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg mb-1 transition-colors
                            ${item.type === 'chapter' ? 'text-[#0F172A] group-hover:text-[#1877F2]' : ''}
                            ${item.type === 'exam' ? 'text-[#1877F2]' : ''}
                            ${item.type === 'comprehensive' ? 'text-[#B45309]' : ''}
                          `}>
                            {item.title}
                          </h3>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-[#94A3B8] flex items-center gap-1.5">
                              {item.type === 'chapter' && <FaCircle className="w-1 h-1 text-[#CBD5E1]" />}
                              {item.meta}
                            </span>
                            
                            {/* Exam specific link */}
                            {(item.type === 'exam' || item.type === 'comprehensive') && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                                <span className={`text-sm font-bold cursor-pointer hover:underline
                                  ${item.type === 'comprehensive' ? 'text-[#F59E0B] bg-[#FFFBEB] px-2 py-0.5 rounded' : 'text-[#1877F2]'}
                                `}>
                                  {item.examTypeLabel}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Chevron Arrow - Only for chapters */}
                        {item.type === 'chapter' && (
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:-translate-x-1">
                            <BiChevronLeft className="w-6 h-6 text-[#94A3B8] group-hover:text-[#1877F2]" />
                          </div>
                        )}
                      </div>

                      {/* Right Side Actions */}
                      <div className="flex items-center gap-4 mr-4">
                        {/* Status Badge */}
                        {item.status && (
                          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                            item.status === 'published'
                              ? 'bg-[#ECFDF5] text-[#10B981] border-[#D1FAE5]'
                              : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                          }`}>
                            {item.status === 'published' ? 'منشور' : 'مسودة'}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-1 border-r border-[#E2E8F0] pr-4 mr-1">
                          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#1877F2] hover:bg-[#EFF6FF] transition-all">
                            <BiPencil className="w-5 h-5" />
                          </button>
                          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all">
                            <BiTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
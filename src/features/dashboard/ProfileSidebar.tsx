import { 
  ExternalLink,  
  Globe, 
  Edit2, 
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {FaLinkedin} from 'react-icons/fa'

export function ProfileSidebar() {
  return (
    <Sidebar className="border-none bg-transparent" collapsible="none">
      <SidebarContent className="gap-6 p-0">
        
        {/* Profile Card Section */}
        <SidebarGroup className="bg-white rounded-[2.5rem] p-8 shadow-sm border-none">
          <SidebarGroupContent className="flex flex-col items-center">
            
            <h2 className="text-xl font-bold text-slate-900 self-start mb-6">
              Profile & Presence
            </h2>

            <Avatar className="w-24 h-24 mb-4 ring-0">
              <AvatarImage src="/mentor-avatar.jpg" />
              <AvatarFallback>EC</AvatarFallback>
            </Avatar>

            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-slate-900">Dr. Emily Chen</h3>
              <p className="text-xs text-slate-500 font-medium">
                PhD Cognitive Science • 10+ yrs exp
              </p>
            </div>

            {/* Bio Section */}
            <div className="w-full space-y-3 mb-8">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Personal Bio
              </h4>
              <div className="bg-[#eff4ff] p-5 rounded-2xl">
                <p className="text-sm leading-relaxed text-slate-600">
                  Specialized in helping undergraduates navigate academic writing and research methodologies. Former admissions officer with deep insights into graduate school applications.
                </p>
              </div>
            </div>

            {/* Links Section */}
            <div className="w-full space-y-3 mb-8">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Professional Links
              </h4>
              <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between bg-[#eff4ff] hover:bg-blue-100 text-blue-700 rounded-xl h-12 px-4 border-none"
                  >
                    <div className="flex items-center gap-3">
                      <FaLinkedin className="w-4 h-4" />
                      <span className="text-sm font-semibold">LinkedIn Profile</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </Button>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between bg-[#eff4ff] hover:bg-blue-100 text-blue-700 rounded-xl h-12 px-4 border-none"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-semibold">Academic Portfolio</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <Button 
              variant="outline" 
              className="w-full rounded-full border-blue-50 text-blue-600 hover:bg-blue-50 font-semibold py-6"
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support Card Section */}
        <SidebarGroup className="bg-[#1e293b] rounded-[2.5rem] p-8 text-white border-none shadow-lg">
          <SidebarGroupContent>
            <h4 className="text-lg font-bold mb-2">Need Assistance?</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Our concierge support team is available 24/7 for mentors.
            </p>
            <Button 
              variant="secondary" 
              className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-full font-bold h-12"
            >
              Contact Support
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
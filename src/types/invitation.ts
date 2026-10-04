export interface InvitationData {
    invitation_id?: string;
    template_id: string;
    bride_name: string;
    groom_name: string;
    isPreview?: boolean;
    content_data: {
        coverPhoto?: string;
        bgPhoto?: string;
        heroPhotos?: string[];
        closingPhoto?: string;
        bridePhoto?: string;
        groomPhoto?: string;
        resepsiPhoto?: string;
        akadPhoto?: string;
        loveStoryPhoto?: string;
        musicUrl?: string;
        quote?: string;
        quote_source?: string;
        bride_details?: { fullName: string; order: string; fatherName: string; motherName: string; ig: string };
        groom_details?: { fullName: string; order: string; fatherName: string; motherName: string; ig: string };
        events?: {

            akad?: { day?: string; date: string; time: string; location: string; mapUrl: string };
            resepsi?: { day?: string; date: string; time: string; location: string; mapUrl: string };
        };
        gift?: {
            enabled: boolean;
            banks: { name: string; account: string; holder: string }[];

            physical?: {
                recipientName?: string;
                phone?: string;
                address?: string;
            };
        };
        live_stream?: { enabled: boolean; url: string };
        closing_text?: string;
        sections: {
            gallery: {
                enabled: boolean;
                videoUrl?: string; // Jadikan opsional dengan tanda tanya (?)
                photos?: string[];
            };
        };
        theme_colors?: {
            primary: string;
            secondary: string;
            accent: string;
            text: string;
            textDark: string;
        };
        love_story?: { enabled: boolean; stories: { year: string; text: string }[] };
    };
}
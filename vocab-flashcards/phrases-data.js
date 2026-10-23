// Work phrases for the Speaking tab: ready-made lines for meetings, client
// calls and demos, in American English.
//
// Markup in `text`:
//   *dash*board   the stressed syllable or word (say it louder, longer, higher)
//   |             a short pause between thought groups
//   ↗ ↘           the voice rises or falls here
// `chunk` is the collocation or pattern worth reusing, `tip` an optional
// pronunciation note aimed at Vietnamese speakers.
window.PHRASE_SITUATIONS = [
  { id: 'meetings', label: 'Meetings' },
  { id: 'calls', label: 'Client calls' },
  { id: 'demos', label: 'Demos' },
];

window.PHRASES = [
  // Meetings
  { id: 'm01', sit: 'meetings', text: "Let's get *start*ed. | The *first* item on the *a*genda | is the re*lease* date. ↘", chunk: 'item on the agenda', vi: 'Chúng ta bắt đầu nhé. Mục đầu tiên trong chương trình họp là ngày phát hành.' },
  { id: 'm02', sit: 'meetings', text: "*Yes*terday I *fin*ished the *log*in page. | To*day* I'm *work*ing on the *tests*. ↘", chunk: 'work on something', vi: 'Hôm qua tôi đã làm xong trang đăng nhập. Hôm nay tôi đang viết các bài kiểm thử.', tip: 'finished /ˈfɪn.ɪʃt/: say the final /t/ of -ed. tests /tests/: say /t/ and /s/ at the end.' },
  { id: 'm03', sit: 'meetings', text: "I'm *blocked* | *wait*ing for *da*tabase access. ↘", chunk: 'be blocked (on something)', vi: 'Tôi đang bị kẹt vì chờ quyền truy cập cơ sở dữ liệu.', tip: 'blocked /blɑːkt/ ends in /kt/. Don\'t stop at "block".' },
  { id: 'm04', sit: 'meetings', text: "Could you *clar*ify | what you *mean* by *that*? ↗", chunk: 'clarify what you mean', vi: 'Bạn có thể làm rõ ý bạn là gì không?', tip: 'that /ðæt/: put your tongue between your teeth for /ð/, not /d/ or /z/.' },
  { id: 'm05', sit: 'meetings', text: "I *see* your *point*, | but I have a *dif*ferent *view*. ↘", chunk: 'see your point', vi: 'Tôi hiểu ý bạn, nhưng tôi có quan điểm khác.' },
  { id: 'm06', sit: 'meetings', text: "I *to*tally a*gree* with *Sar*ah on this. ↘", chunk: 'totally agree with someone', vi: 'Tôi hoàn toàn đồng ý với Sarah về việc này.' },
  { id: 'm07', sit: 'meetings', text: "Just to make *sure* we're on the same *page*: | we *ship* on *Fri*day. ↘", chunk: 'on the same page', vi: 'Để chắc chắn mọi người hiểu giống nhau: chúng ta phát hành vào thứ Sáu.', tip: 'ship /ʃɪp/: short /ɪ/, not "sheep" /ʃiːp/.' },
  { id: 'm08', sit: 'meetings', text: "Let's *take* this *off*line. ↘", chunk: 'take something offline', vi: 'Chúng ta bàn riêng việc này sau cuộc họp nhé.', tip: 'this /ðɪs/: tongue between your teeth for /ð/, and end with a clear /s/.' },
  { id: 'm09', sit: 'meetings', text: "Can we *cir*cle *back* to this *la*ter? ↗", chunk: 'circle back to something', vi: 'Chúng ta quay lại vấn đề này sau được không?' },
  { id: 'm10', sit: 'meetings', text: "We're on *track* | to *meet* the *dead*line. ↘", chunk: 'on track · meet the deadline', vi: 'Chúng ta đang đúng tiến độ để kịp hạn chót.' },
  { id: 'm11', sit: 'meetings', text: "I'll *fol*low *up* with an *e*mail | after the *meet*ing. ↘", chunk: 'follow up with (an email)', vi: 'Tôi sẽ gửi email tiếp nối sau cuộc họp.' },
  { id: 'm12', sit: 'meetings', text: "Who's going to *take* *own*ership of this? ↘", chunk: 'take ownership of something', vi: 'Ai sẽ chịu trách nhiệm chính cho việc này?', tip: 'own /oʊn/ rhymes with "phone", not "town".' },
  { id: 'm13', sit: 'meetings', text: "I'd like to *raise* a con*cern* | about the *test*ing time. ↘", chunk: 'raise a concern', vi: 'Tôi muốn nêu một mối lo ngại về thời gian kiểm thử.' },
  { id: 'm14', sit: 'meetings', text: "That's a *good* *point*. | I *had*n't thought of *that*. ↘", chunk: "that's a good point", vi: 'Ý đó hay đấy. Tôi chưa nghĩ tới.' },
  { id: 'm15', sit: 'meetings', text: "Sorry to inter*rupt*, | but I have a *quick* *ques*tion. ↘", chunk: 'sorry to interrupt', vi: 'Xin lỗi đã ngắt lời, nhưng tôi có một câu hỏi nhanh.' },
  { id: 'm16', sit: 'meetings', text: "Could you say that a*gain*, | a bit more *slow*ly? ↗", chunk: 'say that again', vi: 'Bạn có thể nói lại chậm hơn một chút không?' },
  { id: 'm17', sit: 'meetings', text: "Let me sum *up* | the *key* points. ↘", chunk: 'sum up the key points', vi: 'Để tôi tóm tắt các ý chính.' },
  { id: 'm18', sit: 'meetings', text: "We need to *pri*oritize the *bug* fixes | over *new* *fea*tures. ↘", chunk: 'prioritize X over Y', vi: 'Chúng ta cần ưu tiên sửa lỗi hơn là làm tính năng mới.', tip: 'bug fixes: a compound noun, so stress the first word, BUG fixes.' },
  { id: 'm19', sit: 'meetings', text: "What are the *next* *steps*? ↘", chunk: 'next steps', vi: 'Các bước tiếp theo là gì?', tip: 'A wh- question usually falls at the end. next steps: say the /t/ of "next" lightly, then /steps/.' },
  { id: 'm20', sit: 'meetings', text: "I'm not *sure* that will *work*, | because of the *bud*get. ↘", chunk: "I'm not sure that will work", vi: 'Tôi không chắc cách đó sẽ hiệu quả, vì vấn đề ngân sách.' },
  { id: 'm21', sit: 'meetings', text: "It's *still* in *prog*ress. | I ex*pect* to *fin*ish it by *Thurs*day. ↘", chunk: 'in progress', vi: 'Việc đó vẫn đang làm. Tôi dự kiến xong trước thứ Năm.', tip: 'expect /ɪkˈspekt/ ends in /kt/. Thursday starts with /θ/: tongue between your teeth.' },
  { id: 'm22', sit: 'meetings', text: "Does *an*yone have any *ques*tions | before we *wrap* *up*? ↗", chunk: 'wrap up', vi: 'Có ai có câu hỏi gì trước khi chúng ta kết thúc không?', tip: 'questions /ˈkwes.tʃənz/: finish with a /z/ sound.' },
  { id: 'm23', sit: 'meetings', text: "I'll keep you *post*ed. ↘", chunk: 'keep someone posted', vi: 'Tôi sẽ cập nhật cho mọi người.' },
  { id: 'm24', sit: 'meetings', text: "Can we *push* the *meet*ing | to *three* o'*clock*? ↗", chunk: 'push (back) a meeting', vi: 'Chúng ta dời cuộc họp sang 3 giờ được không?', tip: 'three /θriː/: start with /θ/, not /t/ or /s/.' },

  // Client calls
  { id: 'c01', sit: 'calls', text: "Hi *ev*eryone, | *thanks* for *join*ing the *call*. ↘", chunk: 'thanks for joining (the call)', vi: 'Chào mọi người, cảm ơn đã tham gia cuộc gọi.', tip: 'thanks /θæŋks/: /θ/ at the start, /ks/ at the end.' },
  { id: 'c02', sit: 'calls', text: "Can you *hear* me o*kay*? ↗", chunk: 'hear me okay', vi: 'Bạn có nghe rõ tôi không?' },
  { id: 'c03', sit: 'calls', text: "Sorry, | you *broke* *up* a *lit*tle. | Could you re*peat* that? ↗", chunk: 'break up (a bad connection)', vi: 'Xin lỗi, tiếng bạn bị ngắt quãng một chút. Bạn có thể nhắc lại không?', tip: 'little: Americans say the middle t softly, like a quick /d/: "LIDDLE".' },
  { id: 'c04', sit: 'calls', text: "I'll *share* my *screen*. | Can you *see* it *now*? ↗", chunk: 'share my screen', vi: 'Tôi sẽ chia sẻ màn hình. Bây giờ bạn thấy chưa?', tip: 'share /ʃer/ starts with "sh". screen /skriːn/ has three consonants together: s-k-r.' },
  { id: 'c05', sit: 'calls', text: "Let me make *sure* | I under*stand* you cor*rect*ly. ↘", chunk: 'make sure I understand', vi: 'Để tôi chắc chắn là mình hiểu đúng ý bạn.' },
  { id: 'c06', sit: 'calls', text: "So what you *need* | is a *fast*er *check*out, | is that *right*? ↗", chunk: 'so what you need is …', vi: 'Vậy điều bạn cần là quy trình thanh toán nhanh hơn, đúng không?' },
  { id: 'c07', sit: 'calls', text: "That's a *great* *ques*tion. | Let me *check* with the *team* | and get *back* to you. ↘", chunk: 'get back to you', vi: 'Câu hỏi rất hay. Để tôi kiểm tra với nhóm rồi trả lời bạn sau.' },
  { id: 'c08', sit: 'calls', text: "We can de*liv*er it | by the *end* of the *month*. ↘", chunk: 'by the end of the month', vi: 'Chúng tôi có thể bàn giao trước cuối tháng.', tip: 'month /mʌnθ/: end with /θ/, tongue between your teeth.' },
  { id: 'c09', sit: 'calls', text: "I'm a*fraid* that's *out*side the *scope* | of this *proj*ect. ↘", chunk: 'outside the scope (of)', vi: 'Tôi e rằng việc đó nằm ngoài phạm vi dự án này.', tip: 'scope /skoʊp/: say the final /p/, lips close at the end.' },
  { id: 'c10', sit: 'calls', text: "Would *Tues*day *morn*ing | *work* for you? ↗", chunk: 'work for you', vi: 'Sáng thứ Ba có tiện cho bạn không?' },
  { id: 'c11', sit: 'calls', text: "Let's set up a *fol*low-up call | for next *week*. ↘", chunk: 'set up a follow-up call', vi: 'Chúng ta hẹn một cuộc gọi tiếp theo vào tuần sau nhé.', tip: 'follow-up (noun) is stressed on FOL; follow UP (verb) on UP.' },
  { id: 'c12', sit: 'calls', text: "I'll *send* you a *sum*mary | after the *call*. ↘", chunk: 'send (someone) a summary', vi: 'Tôi sẽ gửi bạn bản tóm tắt sau cuộc gọi.' },
  { id: 'c13', sit: 'calls', text: "Could you give us a bit more *con*text? ↗", chunk: 'give (some) context', vi: 'Bạn có thể cho chúng tôi thêm chút bối cảnh không?', tip: 'context /ˈkɑːn.tekst/ ends in /kst/. Say all three sounds.' },
  { id: 'c14', sit: 'calls', text: "What's your *main* pri*or*ity | for this *quar*ter? ↘", chunk: 'main priority', vi: 'Ưu tiên chính của bạn trong quý này là gì?' },
  { id: 'c15', sit: 'calls', text: "We *ran* into an *is*sue | with the *pay*ment system. ↘", chunk: 'run into an issue', vi: 'Chúng tôi gặp một vấn đề với hệ thống thanh toán.', tip: 'Link the words: "ra-nin-to-a-nissue". Don\'t pause between them.' },
  { id: 'c16', sit: 'calls', text: "We're *work*ing on a *fix* | and will up*date* you by to*mor*row. ↘", chunk: 'work on a fix', vi: 'Chúng tôi đang sửa và sẽ cập nhật cho bạn trước ngày mai.', tip: 'update (verb) is stressed on DATE; an UPdate (noun) on UP.' },
  { id: 'c17', sit: 'calls', text: "*Thanks* for your *pa*tience. ↘", chunk: 'thanks for your patience', vi: 'Cảm ơn bạn đã kiên nhẫn.', tip: 'patience /ˈpeɪ.ʃəns/: the middle is "sh", not "s".' },
  { id: 'c18', sit: 'calls', text: "Does that make *sense*? ↗", chunk: 'make sense', vi: 'Như vậy có hợp lý không?' },
  { id: 'c19', sit: 'calls', text: "Just to con*firm*, | the *bud*get is *fif*ty *thou*sand? ↗", chunk: 'just to confirm', vi: 'Để xác nhận lại, ngân sách là năm mươi nghìn phải không?', tip: 'FIFty (50) vs fifTEEN (15): the stress tells clients which number you mean.' },
  { id: 'c20', sit: 'calls', text: "I'll *loop* in our *tech* lead. ↘", chunk: 'loop someone in', vi: 'Tôi sẽ mời trưởng nhóm kỹ thuật cùng tham gia.' },
  { id: 'c21', sit: 'calls', text: "Is there *an*ything *else* | you'd like to dis*cuss* to*day*? ↗", chunk: 'anything else', vi: 'Hôm nay bạn còn muốn trao đổi gì nữa không?' },
  { id: 'c22', sit: 'calls', text: "I *think* we've *cov*ered *ev*erything. ↘", chunk: 'cover everything', vi: 'Tôi nghĩ chúng ta đã bàn hết mọi thứ.', tip: 'think /θɪŋk/: /θ/, not /t/. Otherwise it sounds like "tink".' },
  { id: 'c23', sit: 'calls', text: "It was *great* *talk*ing to you. | Have a *nice* *day*! ↘", chunk: 'it was great talking to you', vi: 'Rất vui được nói chuyện với bạn. Chúc bạn một ngày tốt lành!' },
  { id: 'c24', sit: 'calls', text: "Sorry, | I'm *hav*ing some con*nec*tion *is*sues. ↘", chunk: 'connection issues', vi: 'Xin lỗi, kết nối của tôi đang có vấn đề.' },

  // Demos
  { id: 'd01', sit: 'demos', text: "To*day* I'm going to *show* you | our *new* *dash*board. ↘", chunk: "I'm going to show you", vi: 'Hôm nay tôi sẽ cho các bạn xem bảng điều khiển mới.', tip: 'show /ʃoʊ/ starts with "sh", not "s".' },
  { id: 'd02', sit: 'demos', text: "Let me *walk* you *through* | the *main* *fea*tures. ↘", chunk: 'walk someone through something', vi: 'Để tôi hướng dẫn các bạn qua các tính năng chính.', tip: 'walk /wɑːk/: the l is silent. through /θruː/ starts with /θ/.' },
  { id: 'd03', sit: 'demos', text: "*First*, | I'll give you a *quick* *o*verview. ↘", chunk: 'give a quick overview', vi: 'Đầu tiên, tôi sẽ giới thiệu tổng quan nhanh.' },
  { id: 'd04', sit: 'demos', text: "As you can *see* *here*, | the *chart* *up*dates in *real* *time*. ↘", chunk: 'in real time', vi: 'Như các bạn thấy ở đây, biểu đồ cập nhật theo thời gian thực.', tip: '"can" is weak here: /kən/, not /kæn/.' },
  { id: 'd05', sit: 'demos', text: "*This* is where *us*ers log *in*. ↘", chunk: 'log in', vi: 'Đây là nơi người dùng đăng nhập.', tip: 'Phrasal verbs at the end of a sentence stress the particle: log IN.' },
  { id: 'd06', sit: 'demos', text: "*Next*, | I'll *click* on *Set*tings. ↘", chunk: 'click on something', vi: 'Tiếp theo, tôi sẽ bấm vào Cài đặt.' },
  { id: 'd07', sit: 'demos', text: "Let me *zoom* *in* | so you can see it *bet*ter. ↘", chunk: 'zoom in', vi: 'Để tôi phóng to để các bạn thấy rõ hơn.', tip: 'better: the American t sounds like a quick /d/: "BEDDER".' },
  { id: 'd08', sit: 'demos', text: "This *fea*ture | *saves* you a *lot* of *time*. ↘", chunk: 'save (someone) time', vi: 'Tính năng này giúp bạn tiết kiệm rất nhiều thời gian.', tip: 'saves ends in /vz/. "a lot of" links together: "a-LOD-uh".' },
  { id: 'd09', sit: 'demos', text: "Now let's move *on* | to the re*ports*. ↘", chunk: 'move on to something', vi: 'Bây giờ chúng ta chuyển sang phần báo cáo.' },
  { id: 'd10', sit: 'demos', text: "Let me *show* you how it *works* | be*hind* the *scenes*. ↘", chunk: 'behind the scenes', vi: 'Để tôi cho bạn thấy nó hoạt động thế nào ở phía sau.', tip: 'works /wɝːks/ ends in /ks/. scenes ends in /nz/.' },
  { id: 'd11', sit: 'demos', text: "Feel *free* to *stop* me | if you have any *ques*tions. ↘", chunk: 'feel free to …', vi: 'Cứ thoải mái ngắt lời tôi nếu bạn có câu hỏi.' },
  { id: 'd12', sit: 'demos', text: "I'll come *back* to that | at the *end* of the *dem*o. ↘", chunk: 'come back to something', vi: 'Tôi sẽ quay lại câu đó vào cuối buổi demo.' },
  { id: 'd13', sit: 'demos', text: "It *seems* the page is *load*ing *slow*ly. | Give me a *sec*ond. ↘", chunk: 'give me a second', vi: 'Có vẻ trang đang tải chậm. Đợi tôi một chút.' },
  { id: 'd14', sit: 'demos', text: "Here's a *quick* ex*am*ple. ↘", chunk: 'a quick example', vi: 'Đây là một ví dụ nhanh.' },
  { id: 'd15', sit: 'demos', text: "You can *fil*ter the re*sults* | by *date* ↗ | or by *cus*tomer. ↘", chunk: 'filter (results) by …', vi: 'Bạn có thể lọc kết quả theo ngày hoặc theo khách hàng.', tip: 'Choices: the voice rises on the first one and falls on the last.' },
  { id: 'd16', sit: 'demos', text: "We *built* this | based on *feed*back | from *cus*tomers like *you*. ↘", chunk: 'based on feedback', vi: 'Chúng tôi xây dựng tính năng này dựa trên phản hồi của những khách hàng như bạn.' },
  { id: 'd17', sit: 'demos', text: "The *big*gest im*prove*ment is *speed*. | It's *twice* as *fast*. ↘", chunk: 'twice as fast', vi: 'Cải tiến lớn nhất là tốc độ. Nó nhanh gấp đôi.', tip: 'twice ends in /s/; fast ends in /st/. Don\'t drop the final sounds.' },
  { id: 'd18', sit: 'demos', text: "*Un*der the *hood*, | we use *ma*chine *learn*ing. ↘", chunk: 'under the hood', vi: 'Về mặt kỹ thuật bên trong, chúng tôi dùng học máy.', tip: 'learning /ˈlɝː.nɪŋ/: American r, curl your tongue back.' },
  { id: 'd19', sit: 'demos', text: "Would *an*yone like to *try* it them*selves*? ↗", chunk: 'try it yourself', vi: 'Có ai muốn tự mình dùng thử không?' },
  { id: 'd20', sit: 'demos', text: "To sum *up*, | the new *ver*sion is *fast*er ↗ | *saf*er ↗ | and *eas*ier to *use*. ↘", chunk: 'to sum up', vi: 'Tóm lại, phiên bản mới nhanh hơn, an toàn hơn và dễ dùng hơn.', tip: 'Lists: rise on each item, fall on the last one.' },
  { id: 'd21', sit: 'demos', text: "Are there any *ques*tions so *far*? ↗", chunk: 'so far', vi: 'Đến giờ có ai có câu hỏi gì không?' },
  { id: 'd22', sit: 'demos', text: "*Thanks* for your *time* to*day*. ↘", chunk: 'thanks for your time', vi: 'Cảm ơn các bạn đã dành thời gian hôm nay.' },
  { id: 'd23', sit: 'demos', text: "I'll *send* you the *slides* | and a *link* to the *dem*o. ↘", chunk: 'send (someone) the slides', vi: 'Tôi sẽ gửi các bạn slide và đường link tới bản demo.', tip: 'slides /slaɪdz/ ends in /dz/.' },
  { id: 'd24', sit: 'demos', text: "We're *plan*ning to *launch* it | *ear*ly next *quar*ter. ↘", chunk: 'early next quarter', vi: 'Chúng tôi dự định ra mắt vào đầu quý tới.' },
];

// Helpers shared by the Speaking tab and the tests.
window.PHRASE_MARKUP = {
  // The sentence as it should be spoken: markup removed, spacing tidied.
  plain(text) {
    return text.replace(/\*/g, '').replace(/[|↗↘]/g, ' ').replace(/\s+([,.?!:])/g, '$1').replace(/\s+/g, ' ').trim();
  },
  // Thought groups, each a list of parts: plain text, stressed text or a tone arrow.
  groups(text) {
    return text.split('|').map((g) => g.trim().split(/(\*[^*]+\*|[↗↘])/).filter(Boolean).map((p) => {
      if (p === '↗') return { type: 'tone', text: p, dir: 'rise' };
      if (p === '↘') return { type: 'tone', text: p, dir: 'fall' };
      if (p.startsWith('*')) return { type: 'stress', text: p.slice(1, -1) };
      return { type: 'text', text: p };
    }));
  },
};

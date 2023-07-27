$('.php-email-form').submit(function(event) {
  event.preventDefault();

  let form = $(this);
  let loading = form.find('.loading');
  let errorMessage = form.find('.error-message');
  let sentMessage = form.find('.sent-message');

  // Menampilkan pesan "Loading"
  loading.show();
  errorMessage.hide();
  sentMessage.hide();

  // Mengambil data dari form
  let nama = form.find('#nama').val();
  let aduan = form.find('#aduan').val();
  let pesan = form.find('#message').val();
  let wa = form.find('#wa').val();

  // Kirim data ke server menggunakan Ajax
  $.ajax({
    url: form.attr('action'),
    method: 'POST',
    data: {
      nama: nama,
      aduan: aduan,
      pesan: pesan,
      wa: wa
    },
    success: function(response) {
      // Menampilkan pesan "Pesanmu telah terkirim"
      sentMessage.show();
      form[0].reset();
    },
    error: function(xhr, textStatus, errorThrown) {
      // Menampilkan pesan "Gagal Ketika Mengirim Email"
      errorMessage.show();
      console.error(errorThrown);
    },
    complete: function() {
      // Menyembunyikan pesan "Loading"
      loading.hide();
    }
  });
});
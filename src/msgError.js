const msgError = code => {
  switch (code) {
    case '50203':
      return 'ไม่พบช่องสินค้า';
    case '50403':
      return 'ไม่พบสินค้าในช่องสินค้า';
    case '50204':
      return 'ช่องสินค้าที่ท่านเลือกไม่พร้อมใช้งานขณะนี้';
    case '50205':
      return 'มีสินค้าอยู่ในลิฟท์';
    case '50207':
      return 'ลิฟท์ไม่ตอบสนอง';
    case '104001':
      return 'อุปกรณ์ไม่ตอบสนอง';
    default:
      return 'เกิดข้อผิดพลาดกับอุปกรณ์';
  }
};

export default {
  msgError,
};

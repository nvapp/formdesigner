define([
	'underscore',
	'm/PlainConfig',
	'm/FormModel',
	'text!tmpl/news_config.txt'
], function(_, plain, FormModel, config) {

	return describe('测试老版本新闻配置转新版json配置', function() {
		var itemData = '0,NewsTitle,标题,0,0,100,1,1';
		var itemJson = {
			index: 0,
			name: 'NewsTitle',
			label: '标题',
			rowIndex: 0,
			columnIndex: 0,
			width: 100,
			required: true,
			used: true
		};
		
		var fieldsData = '0,NewsTitle,标题,0,0,100,1,1;1,NewsTitle1,标题别名1,1,0,50,0,1;';
		var numberData = '60;' + fieldsData;
		var fieldsParts = [
			'0,NewsTitle,标题,0,0,100,1,1',
			'1,NewsTitle1,标题别名1,1,0,50,0,1'
		]
		var fieldsArray = [{
			index: 0,
			name: 'NewsTitle',
			label: '标题',
			rowIndex: 0,
			columnIndex: 0,
			width: 100,
			required: true,
			used: true
		}, {
			index: 1,
			name: 'NewsTitle1',
			label: '标题别名1',
			rowIndex: 1,
			columnIndex: 0,
			width: 50,
			required: true,
			used: true
		}];

		var rowsJson = [{
			index: 0,
			layout: 'fit',
			selected: false,
			columns: [{
				index:0,
				width:1,
				selected: false,
				content: {
					id:'NewsTitle_field',
					name:'NewsTitle',
					label:'标题',
					type:'text',
					value:'',
					required:true,
					used: true
				}
			}]
		}, {
			index: 1,
			layout: 'fit',
			selected: false,
			columns: [{
				index:0,
				width:0.5,
				selected: false,
				content: {
					id:'NewsTitle1_field',
					name:'NewsTitle1',
					label:'标题别名1',
					type:'text',
					value:'',
					required: false,
					used: true
				}
			}]
		}];
		
		
		it('parse2Item可以正确解析行数据', function() {
			var ret = plain.parse2Item(itemData);	
			expect(ret).toEqual(itemJson);
		});

		it('parse2Item可以解析used=1的数据', function() {
			var unusedData = '0,NewsTitle,标题,0,0,100,1,0;'; 
			var ret = plain.parse2Item(unusedData);
			
			expect(ret.used).toEqual(false);
		});

		it('parse2Fields可以正确解析带60;开头数据,将plainText分成item段', function() {
			var items = plain.parse2Fields(numberData); 

			expect(items.length).toBe(2);
			expect(items).toEqual(fieldsParts);
		});


		it('parse2Fields可以正确解析不带60;开头数据, 将plainText分成item段', function() {
			var items = plain.parse2Fields(fieldsData); 
			expect(items.length).toBe(2);
			expect(items).toEqual(fieldsParts);
		});
			
		it('fields2Json生成json rows数据', function() {
			var ret = plain.fields2Json(fieldsParts);
			expect(ret.length).toBe(2);
			expect(ret).toEqual(rowsJson);
		});


		it('convert方法能将plainText配置转成rows json数据', function() {
			var ret = plain.convert(numberData);
			expect(ret.length).toBe(2);
			expect(ret).toEqual(rowsJson);
		});
	});


	describe('JSON配置生成旧的Plain Text配置测试', function() {
		var rowsJson = plain.convert(config);
		var RowJson = {
			index: 0,
			layout: 'fit',
			columns: [{
				index: 0,
				width: 1,
				content: {
					id: 'newsTitle_field',
					name: 'newsTitle',
					label: '标题',
					type: 'text',
					value: '',
					required: true,
					used: true
				}
			}]
		};
		var PlainRow = '0,newsTitle,标题,0,0,100,1,1'

		it('readOptions从rowJSON中读取正确的数据', function() {
			var options = plain.readOptions(RowJson);	

			expect(options.length).toEqual(1);
			
			expect(options).toEqual([{
				name: 'newsTitle',
				label: '标题',
				rowIndex: 0,
				columnIndex: 0,
				width: 100,
				required: 1,
				used: 1
			}]);
		});

		it('toPlain可以将readOptions的return转换成正确的plain config',
			function() {
				
				var options = plain.readOptions(RowJson);	
				options[0].index = 0;
				var text = plain.toPlain(options[0]);

				expect(text).not.toBeUndefined();
				expect(text).toEqual(PlainRow);
			});

		it('generate将JSON格式的配置生成PlainText', function() {
			var json = plain.convert(config);
			var text = plain.generate(json);
			var trimed = $.trim(config);
			expect(text).toEqual(trimed);
		});
	});
});


